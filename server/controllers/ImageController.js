const { v4: uuidv4 } = require('uuid')
const db = require('../config/db.config.js')
const Op = db.Sequelize.Op
const Image = db.image
const Album = db.album
const cloudinary = require('../config/cloudinary.config.js')

module.exports = {
  async initiateUpload (req, res) {
    try {
      const visibility = req.body.visibility
      const albums = req.body.albums
      console.log(albums)
      const publicId = uuidv4()
      const cancellationToken = uuidv4()
      const image = await Image.create({
        id: publicId,
        visibility: visibility,
        userId: req.user.id,
        cancellationToken: cancellationToken
      })
      const storedAlbums = await Album.findAll({
        where: {
          name: {
            [Op.in]: albums
          }
        }
      })
      await image.addAlbums(storedAlbums)
      const timestamp = Math.round((new Date()).getTime() / 1000)
      const signature = cloudinary.utils.api_sign_request({ timestamp, public_id: publicId, folder: req.user.username }, process.env.CLOUDINARY_API_SECRET)
      console.log(timestamp)
      console.log(publicId)
      console.log(signature)
      res.status(201).send({
        timestamp,
        signature,
        publicId,
        cancellationToken
      })
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened during image upload')
    }
  },

  async finalizeUpload (req, res) {
    try {
      const publicId = req.body.publicId
      const url = req.body.url
      console.log(publicId)
      console.log(url)
      const image = await Image.findByPk(publicId)
      if (image) {
        await image.update({
          url: url
        })
        res.status(200).send()
      } else {
        res.status(404).send('Image with given ID not found')
      }
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened during upload verification')
    }
  },

  async cancelUpload (req, res) {
    try {
      const imageId = req.params.imageId
      const username = req.params.username
      const cancellationToken = req.params.cancellationToken
      console.log('cancelUpload called')
      const image = await Image.findByPk(imageId)
      if (!image) {
        return res.status(404).send('image does not exist')
      }
      if (image.cancellationToken !== cancellationToken) {
        return res.status(403).send('Unauthorized')
      }
      try {
        await cloudinary.api.resource(`${username}/${imageId}`) // ha nem létezik a kép, akkor error jön
        return res.status(400).send('invalid cancellation')
      } catch {
        await image.destroy()
        return res.status(200).send()
      }
    } catch (err) {
      console.log(err)
      res.status(500).send('Failed to cancel upload')
    }
  },

  async deleteImage (req, res) { // most csak saját user, később admin is
    try {
      const imageId = req.params.imageId
      const userId = req.user.id
      const image = await Image.findByPk(imageId)
      if (!image) {
        return res.status(404).send('Image not found')
      }
      if (image.userId === userId) {
        const response = await cloudinary.uploader.destroy(`${req.user.username}/${image.id}`)
        if (response.result !== 'ok' && response.result !== 'not found') {
          console.log('MIA A FASSAZDGSADUZASGDUASZDGASDSASDAS')
          console.log(response.result)
          console.log(response.result === 'not found')
          return res.status(400).send('cloudinary error')
        }
        await image.destroy()
        return res.status(200).send()
      } else {
        return res.status(403).send('Unauthorized')
      }
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while deleting the image')
    }
  },

  async getImages (req, res) {
    try {
      let images
      const user = req.query.user
      const fromDate = req.query.from
      const toDate = req.query.to
      const albumName = req.query.album
      const limit = req.query.limit
      const sort = req.query.sort
      const queryObject = {
        where: {},
        order: []
      }
      if (user) {
        if (albumName) {
          return res.status(400).send('Invalid query')
        }
        queryObject.where.userId = req.user.id
        if (user !== req.user.id) {
          queryObject.where.visibilty = true
        }
      }
      if (sort) {
        if (sort === 'date:desc') {
          queryObject.order.push(['createdAt', 'DESC'])
        } else if (sort === 'date:asc') {
          queryObject.order.push(['createdAt', 'ASC'])
        }
      }
      if (fromDate || toDate) {
        queryObject.where.createdAt = {}
      }
      if (fromDate) {
        queryObject.where.createdAt[Op.gt] = fromDate
      }
      if (toDate) {
        queryObject.where.createdAt[Op.lt] = toDate
      }
      if (limit) {
        queryObject.limit = Number(limit)
      } else {
        queryObject.limit = 20
      }
      if (albumName) {
        const album = await Album.findByPk(albumName)
        if (album) {
          if (album.userId === req.user.id || album.visibility) {
            images = await album.getImages(queryObject)
          } else {
            return res.status(403).send('Unauthorized')
          }
        } else {
          return res.status(404).send('the given album does not exist')
        }
      } else {
        images = await Image.findAll(queryObject)
      }
      res.status(200).send(images)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while fetching images')
    }
  }
}
