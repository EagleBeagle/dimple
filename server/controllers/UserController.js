const db = require('../config/db.config.js')
const User = db.user
const Image = db.image
const Comment = db.comment
const Album = db.album
const Op = db.Sequelize.Op
const jwt = require('jsonwebtoken')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const cloudinary = require('../config/cloudinary.config.js')
const DatauriParser = require('datauri/parser')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const emailTransporter = require('../config/email.config.js')

module.exports = {
  async signup (req, res) {
    try {
      const { email, username } = req.body
      const password = await bcrypt.hash(req.body.password, 10)
      const confirmationToken = uuidv4()
      const user = await User.create({
        email,
        username,
        password,
        confirmationToken
      })
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username
      }
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET)

      await emailTransporter.sendMail({
        from: {
          name: 'Dimple',
          address: process.env.GMAIL_ADDRESS
        },
        to: user.email,
        subject: 'Verify Your Email Address',
        html: `<p>Hi ${username}!</p>
               <p>To confirm that this Dimple account belongs to you, please
                 <a href="https://${req.hostname}/user/confirm/${confirmationToken}">
                   click here
                 </a>
               to verify.</p>
               <p>The Dimple Team</p>`
      })

      res.status(201).send({
        id: user.id,
        username,
        avatar: user.avatar,
        admin: user.admin,
        jwtToken,
        confirmationToken
      })
    } catch (err) {
      console.log(err)
      if (err.name === 'SequelizeUniqueConstraintError') {
        if (err.errors[0].path === 'users.email') {
          res.status(400).send('Email already in use')
        } else if (err.errors[0].path === 'users.username') {
          res.status(400).send('Username already in use')
        } else {
          res.status(400).send('Unavailable credentials')
        }
      } else {
        res.status(500).send('an error happened during signup')
      }
    }
  },

  async confirm (req, res) {
    try {
      const confirmationToken = req.params.confirmationToken
      const user = await User.findOne({ where: { confirmationToken } })
      if (!user) {
        return res.status(404).send('User not found')
      }
      user.confirmationToken = null
      await user.save()
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username
      }
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET)
      res.status(200).send({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        admin: user.admin,
        jwtToken,
        confirmationToken: user.confirmationToken
      })
    } catch (err) {
      console.log(err)
      res.status(500).send('Error during user confirmation')
    }
  },

  signin (req, res) {
    passport.authenticate(
      'local',
      { session: false },
      (error, user) => {
        if (error || !user) {
          return res.status(400).send({ error: 'account doesnt exist' })
        }
        const payload = {
          id: user.id,
          email: user.email,
          username: user.username
        }

        req.login(payload, { session: false }, async (error) => {
          if (error) {
            res.status(400).send({ error })
          }
          const jwtToken = jwt.sign(payload, process.env.JWT_SECRET)

          res.status(200).send({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            admin: user.admin,
            jwtToken,
            confirmationToken: user.confirmationToken
          })
        })
      }
    )(req, res)
  },

  async forgotPassword (req, res) {
    try {
      const email = req.body.email
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).send('No user with given email exists')
      }
      const resetPasswordToken = uuidv4()
      user.resetPasswordToken = resetPasswordToken
      const dateNow = new Date()
      user.resetPasswordTokenExpiration = dateNow.setDate(dateNow.getDate() + 2)
      await user.save()
      await emailTransporter.sendMail({
        from: {
          name: 'Dimple',
          address: process.env.GMAIL_ADDRESS
        },
        to: user.email,
        subject: 'Dimple Password Reset',
        html: `<p>Hi ${user.username}!</p>
               <p>We have received a request to reset your password, which can be done by
                 <a href="https://${req.hostname}/user/resetpassword/${resetPasswordToken}">
                   clicking here.
                 </a>
               </p>
               <p>
               If you didn't request to reset your password then you may safely ignore this email - your password will not be changed.</p>
               <p>The Dimple Team</p>`
      })
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Error while trying to initiate password reset')
    }
  },

  async resetPassword (req, res) {
    try {
      const resetPasswordToken = req.params.resetPasswordToken
      const user = await User.findOne({ where: { resetPasswordToken } })
      if (!user || !user.resetPasswordTokenExpiration || user.resetPasswordTokenExpiration < new Date()) {
        return res.status(400).send('Invalid request')
      }
      const password = await bcrypt.hash(req.body.password, 10)
      user.password = password
      user.resetPasswordToken = null
      await user.save()
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Error during password reset')
    }
  },

  async update (req, res) {
    try {
      const username = req.params.username
      const admin = req.body.admin
      const notification = req.body.notification
      if (typeof admin !== 'undefined') {
        if (req.user.admin) {
          await User.update({ admin }, { where: { username } })
        } else {
          return res.status(403).send('Unauthorized')
        }
      }
      if (typeof notification !== 'undefined') {
        await User.update({ notification }, { where: { username } })
      }
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Error during user update')
    }
  },

  async delete (req, res) {
    try {
      const username = req.params.username
      const user = await User.findOne({ where: { username } })
      if (user) {
        const images = await Image.findAll({ where: { fk_username: user.username } })
        for (let i = 0; i < images.length; i++) {
          const response = await cloudinary.uploader.destroy(`${user.username}/${images[i].id}`)
          if (response.result !== 'ok' && response.result !== 'not found') {
            return res.status(400).send('cloudinary error')
          }
          await images[i].destroy()
        }
        await Comment.destroy({ where: { fk_username: user.username } })
        await Album.destroy({ where: { fk_username: user.username } })
      } else {
        return res.status(404).send('User not found')
      }

      await user.destroy()
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Error during user update')
    }
  },

  async changeAvatar (req, res) {
    try {
      const parser = new DatauriParser()
      const username = req.params.username
      if (username !== req.user.username) {
        return res.status(403).send('Unauthorized')
      }
      parser.format(path.extname(req.file.originalname).toString(), req.file.buffer)
      const publicId = uuidv4()
      await cloudinary.uploader.upload(parser.content, {
        folder: `${req.user.username}/avatar`,
        public_id: publicId
      })
      const user = await User.findByPk(req.user.id)
      if (user.avatar) {
        const response = await cloudinary.uploader.destroy(`${user.username}/avatar/${user.avatar}`)
        if (response.result !== 'ok' && response.result !== 'not found') {
          return res.status(400).send('cloudinary error')
        }
      }
      user.avatar = publicId
      await user.save()
      res.status(200).send(user.avatar)
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  },

  async get (req, res) {
    try {
      const username = req.params.username
      const user = await User.findOne({ where: { username } })
      if (!user) {
        return res.status(404).send('User not found')
      }
      let imageCount
      let hasPeople = false
      if (req.user.username === user.username) {
        imageCount = await Image.count({
          where: {
            fk_username: user.username,
            cancellationToken: null
          }
        })
        const albums = await Album.findAll({
          where: {
            type: 'people',
            fk_username: user.username
          },
          attributes: {
            include: [
              [
                db.Sequelize.literal(`(
                  SELECT COUNT(*) FROM albumimage
                  WHERE albumimage.albumId = album.id AND 
                  (SELECT trashed FROM images WHERE id = albumimage.imageId ) = 0 AND 
                  (SELECT cancellationToken FROM images WHERE id = albumimage.imageId ) IS NULL
                )`), 'imageCount'
              ]
            ]
          }
        })
        for (let i = 0; i < albums.length; i++) {
          if (albums[i].dataValues.imageCount >= 2) {
            hasPeople = true
            break
          }
        }
      } else {
        imageCount = await Image.count({
          where: {
            fk_username: user.username,
            visibility: true,
            cancellationToken: null
          }
        })
      }
      const response = {
        username: user.username,
        avatar: user.avatar,
        imageCount
      }
      if (user.id === req.user.id) {
        response.notification = user.notification
        response.hasPeople = hasPeople
      }
      return res.status(200).send(response)
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  },

  async search (req, res) {
    try {
      const search = req.query.search
      const admin = req.query.admin
      const limit = req.query.limit
      const queryObject = {
        where: {
          username: {
            [Op.and]: {
              [Op.regexp]: `^${search}.*`
            }
          }
        },
        limit: limit ? Number(limit) : null
      }
      if (!admin) {
        queryObject.where.username[Op.and][Op.ne] = req.user.username
      }
      const userResults = await User.findAll(queryObject)
      const users = []
      if (admin) {
        if (req.user.admin) {
          for (let i = 0; i < userResults.length; i++) {
            users.push({
              username: userResults[i].username,
              email: userResults[i].email,
              confirmed: !userResults[i].confirmationToken,
              admin: userResults[i].admin,
              createdAt: userResults[i].createdAt,
              imageCount: await Image.count({
                where: {
                  fk_username: userResults[i].username,
                  visibility: true,
                  cancellationToken: null
                }
              })
            })
          }
          return res.status(200).send(users)
        } else {
          return res.status(403).send()
        }
      } else {
        for (let i = 0; i < userResults.length; i++) {
          users.push({
            username: userResults[i].username,
            avatar: userResults[i].avatar,
            imageCount: await Image.count({
              where: {
                fk_username: userResults[i].username,
                visibility: true,
                cancellationToken: null
              }
            })
          })
        }
      }
      return res.status(200).send(users)
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  },

  async getAdminInfo (req, res) {
    try {
      const cloudinaryInfo = await cloudinary.api.usage()
      const userCount = await User.count()
      const photoCount = await Image.count()
      res.status(200).send({
        userCount,
        photoCount,
        cloudinaryUsage: cloudinaryInfo.credits.used_percent
      })
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  }
}
