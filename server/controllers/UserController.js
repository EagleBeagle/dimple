const db = require('../config/db.config.js')
const User = db.user
const Image = db.image
const Op = db.Sequelize.Op
const jwt = require('jsonwebtoken')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const cloudinary = require('../config/cloudinary.config.js')
const DatauriParser = require('datauri/parser')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

module.exports = {
  async signup (req, res) {
    try {
      const { email, username } = req.body
      const password = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({
        email,
        username,
        password
      })
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username
      }
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET)

      res.status(201).send({
        id: user.id,
        username,
        avatar: user.avatar,
        jwtToken
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
            jwtToken
          })
        })
      }
    )(req, res)
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
      if (req.user.username === user.username) {
        imageCount = await Image.count({
          where: {
            fk_username: user.username,
            cancellationToken: null
          }
        })
        console.log(imageCount)
      } else {
        imageCount = await Image.count({
          where: {
            fk_username: user.username,
            visibility: true,
            cancellationToken: null
          }
        })
      }
      return res.status(200).send({
        username: user.username,
        avatar: user.avatar,
        imageCount
      })
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  },

  async search (req, res) {
    try {
      const search = req.query.search
      const userResults = await User.findAll({
        where: {
          username: {
            [Op.and]: {
              [Op.regexp]: `^${search}.*`,
              [Op.ne]: req.user.username
            }
          }
        }
      })
      const users = []
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
      console.log(users)
      return res.status(200).send(users)
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  }
}
