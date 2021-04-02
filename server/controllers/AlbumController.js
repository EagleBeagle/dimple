const cloudinary = require('../config/cloudinary.config.js')
const db = require('../config/db.config.js')
const Album = db.album
const Image = db.image

module.exports = {
  async create (req, res) {
    try {
      const { name, description, visibility } = req.body
      const album = await Album.create({
        name,
        description,
        visibility,
        fk_username: req.user.username
      })
      res.status(201).send(album)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened during album creation')
    }
  },

  async get (req, res) {
    try {
      const id = req.query.id
      const user = req.query.user
      const imageId = req.query.image
      const queryObject = {
        where: {},
        order: [
          ['name', 'ASC']
        ],
        attributes: {
          include: []
        }
      }
      let albums
      if ((id && user) || (id && imageId) || (user && imageId) || (!id && !user && !imageId)) {
        return res.status(400).send('Invalid query')
      }
      queryObject.attributes.include.push([
        db.Sequelize.literal(`(
          SELECT COUNT(*) FROM albumimage
          WHERE albumimage.albumId = album.id
        )`), 'imageCount'
      ])
      if (id) {
        queryObject.where.id = req.query.id
        const album = await Album.findOne(queryObject)
        if (!album) {
          return res.status(403).send('Invalid id')
        }
        if (album.fk_username === req.user.username || album.visibility) {
          return res.status(200).send(album)
        } else {
          return res.status(403).send('Unauthorized')
        }
      } else if (imageId) {
        const image = await Image.findByPk(imageId)
        if (!image) {
          return res.status(400).send('Invalid image id')
        }
        queryObject.joinTableAttributes = []
        if (image.fk_username !== req.user.username) {
          queryObject.where.visibility = true
        }
        albums = await image.getAlbums(queryObject)
      } else if (user) {
        queryObject.where.fk_username = user
        if (user !== req.user.username) {
          queryObject.where.visibility = true
        }
        albums = await Album.findAll(queryObject)
      }
      for (let i = 0; i < albums.length; i++) {
        albums[i].dataValues.images = await albums[i].getImages({
          order: db.Sequelize.literal('rand()'),
          limit: 4,
          attributes: ['id', 'fk_username'],
          joinTableAttributes: []
        })
      }
      res.status(200).send(albums)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while fetching the albums')
    }
  },

  async delete (req, res) { // most csak saját user, később admin is
    try {
      const id = req.params.id
      const username = req.user.username
      const album = await Album.findByPk(id)
      if (!album) {
        return res.status(404).send('Invalid id')
      }
      if (album.fk_username === username) {
        await album.destroy()
        return res.status(200).send()
      } else {
        return res.status(403).send('Unauthorized')
      }
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while deleting the image')
    }
  },

  async download (req, res) {
    try {
      const albumId = req.params.id
      const username = req.user.username
      const album = await Album.findByPk(albumId)
      if (!album) {
        return res.status(400).send('Invalid request')
      }
      if (album.fk_username === username || album.visibility) {
        const imageIds = (await album.getImages({
          attributes: ['id'],
          joinTableAttributes: []
        })).map(result => `${album.fk_username}/${result.id}`)
        const date = new Date(Date.now()).toLocaleString().split(',')[0].replace(/\//g, '-')
        const url = cloudinary.utils.download_zip_url({
          public_ids: imageIds,
          target_public_id: `${album.name}-${date}`,
          flatten_folders: true
        })
        return res.status(200).send(url)
      } else {
        return res.status(403).send('Unauthorized')
      }
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while preparing the download')
    }
  }
}
