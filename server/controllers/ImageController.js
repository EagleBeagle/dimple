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
      const image = await Image.create({
        id: publicId,
        visibility: visibility,
        userId: req.user.id
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
        publicId
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
      console.log('retekRETEKETEKTEKTKETKTEKETKETKETKETKETKEKTEKTEKTKEK')
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
      console.log('cancelUpload called')
      const image = await Image.findByPk(imageId)
      if (!image) {
        return res.status(404).send('Image not found')
      }
      if (image.url) {
        return res.status(400).send()
      }
      await image.destroy()
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Failed to cancel upload')
    }
  },

  async deleteImage (req, res) { // most csak saját user, később admin is
    try {
      const imageId = req.params.imageId
      const userId = req.user.id
      console.log('deleteImage called')
      const image = await Image.findByPk(imageId)
      if (!image) {
        return res.status(404).send('Image not found')
      }
      if (image.userId === userId) {
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
      if (req.query.album) {
        const album = await Album.findByPk(req.query.album)
        images = await album.getImages()
      } else {
        images = await Image.findAll({
          where: {
            userId: req.user.id,
            url: {
              [Op.not]: null
            }
          }
        })
      }
      res.status(200).send(images)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while fetching images')
    }
  },

  async getSingleFile (req, res) { // probably nem kell már
    try {
      const image = await Image.findByPk(`${req.params.username}/${req.params.filename}`)

      if (!image.visibility) {
        if (!req.user) {
          return res.status(403).send('Unauthorized')
        } else if (image.userId !== req.user.id) {
          return res.status(403).send('Unauthorized')
        }
      }
      await b2.authorize()
      const response = await b2.downloadFileByName({
        bucketName: 'dimple-private-images',
        fileName: `${req.params.username}/${req.params.filename}`,
        responseType: 'arraybuffer'
      })
      res.write(response.data, 'binary')
      res.status(200).end(null, 'binary')
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while fetching the image')
    }
  }
}
