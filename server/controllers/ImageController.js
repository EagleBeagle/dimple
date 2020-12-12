const { v4: uuidv4 } = require('uuid')
const db = require('../config/db.config.js')
const Op = db.Sequelize.Op
const Image = db.image
const Album = db.album
const b2 = require('../config/b2.config.js')

module.exports = {
  async upload (req, res) {
    try {
      const visibility = req.body.visibility
      const albums = req.body.albums ? req.body.albums.split(',') : []
      const id = uuidv4()
      const image = await Image.create({
        id: `${req.user.username}/${id}.${req.file.mimetype.split('/')[1]}`,
        visibility: visibility,
        uploaded: false,
        userId: req.user.id
      })
      const storedAlbums = await Album.findAll({
        where: {
          name: {
            [Op.or]: albums
          }
        }
      })
      await image.addAlbums(storedAlbums)

      await b2.authorize()
      const { uploadUrl, authorizationToken } = (await b2.getUploadUrl({
        bucketId: process.env.B2_BUCKET_ID
      })).data
      await b2.uploadFile({
        uploadUrl: uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: image.id,
        data: req.file.buffer,
        mime: req.file.mimetype
      })
      res.status(201).send(image)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened during image upload')
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
            userId: req.user.id
          }
        })
      }
      res.status(200).send(images)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while fetching images')
    }
  },

  async getSingleFile (req, res) {
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
