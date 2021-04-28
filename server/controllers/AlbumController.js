const cloudinary = require('../config/cloudinary.config.js')
const db = require('../config/db.config.js')
const Op = db.Sequelize.Op
const Album = db.album
const Image = db.image
const Face = db.face

module.exports = {
  async create (req, res) {
    try {
      const { name, description, visibility } = req.body
      const albums = await Album.findAll({ where: { fk_username: req.user.username } })
      albums.forEach(album => {
        if (album.name === name) {
          return res.status(400).send('Name already used')
        }
      })
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
      const visibility = req.query.visibility
      const people = req.query.people
      const admin = req.query.admin
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
      if (admin) {
        if (req.user.admin) {
          const albums = await Album.findAll({
            attributes: {
              include: [
                [
                  db.Sequelize.literal(`(
                    SELECT COUNT(*) FROM albumimage
                    WHERE albumimage.albumId = album.id
                  )`), 'imageCount'
                ]
              ]
            }
          })
          return res.status(200).send(albums)
        } else {
          return res.status(403).send()
        }
      }
      if ((id && user) || (id && imageId) || (user && imageId) || (!id && !user && !imageId) || (people && id) || (people && imageId)) {
        return res.status(400).send('Invalid query')
      }
      if (people) { // típusváltás
        queryObject.where.type = 'people'
      } else {
        queryObject.where.type = 'user'
      }
      queryObject.attributes.include.push([
        db.Sequelize.literal(`(
          SELECT COUNT(*) FROM albumimage
          WHERE albumimage.albumId = album.id AND 
          (SELECT trashed FROM images WHERE id = albumimage.imageId ) = 0 AND 
          (SELECT cancellationToken FROM images WHERE id = albumimage.imageId ) IS NULL
        )`), 'imageCount'
      ])
      if (id) {
        queryObject.where.id = req.query.id
        delete queryObject.where.type
        const album = await Album.findOne(queryObject)
        if (!album) {
          return res.status(404).send('Album not found')
        }
        if (album.fk_username === req.user.username || album.visibility || req.user.admin) {
          if (album.fk_username !== req.user.username) {
            album.dataValues.imageCount = await album.countImages({
              where: {
                visibility: true,
                cancellationToken: null
              }
            })
          }
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
        if (visibility === 'true') {
          queryObject.where.visibility = 1
        } else if (visibility === 'false') {
          queryObject.where.visibility = 0
        }
        albums = await Album.findAll(queryObject)
      }
      for (let i = 0; i < albums.length; i++) {
        if (albums[i].fk_username === req.user.username) {
          albums[i].dataValues.images = await albums[i].getImages({
            order: db.Sequelize.literal('rand()'),
            where: {
              trashed: false,
              cancellationToken: null
            },
            limit: 4,
            attributes: ['id', 'fk_username'],
            joinTableAttributes: []
          })
        } else {
          albums[i].dataValues.images = await albums[i].getImages({
            order: db.Sequelize.literal('rand()'),
            where: {
              trashed: false,
              visibility: true,
              cancellationToken: null
            },
            limit: 4,
            attributes: ['id', 'fk_username'],
            joinTableAttributes: []
          })
        }
        if (albums[i].fk_username !== req.user.username) {
          albums[i].dataValues.imageCount = await albums[i].countImages({
            where: {
              visibility: true,
              cancellationToken: null
            }
          })
        }
      }
      if (people) {
        albums = albums.filter(album => album.dataValues.imageCount > 1)
      }
      res.status(200).send(albums)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while fetching the albums')
    }
  },

  async update (req, res) {
    try {
      const albumId = req.params.id
      const name = req.body.name
      const images = req.body.images
      const visibility = req.body.visibility
      if (!images && !name && typeof visibility === 'undefined') {
        return res.status(400).send()
      }
      const album = await Album.findByPk(albumId)
      if (!album) {
        return res.status(404).send('Album not found')
      }
      if (album.fk_username !== req.user.username && !req.user.admin) {
        return res.status(403).send('Unauthorized')
      }
      if (name) {
        if (album.type !== 'people') {
          return res.status(400).send()
        }
        album.name = name
        await album.save()
      }
      if (images) {
        await album.addImages(images)
      }
      if (typeof visibility !== 'undefined') {
        album.visibility = visibility
        await album.save()
      }
      return res.status(200).send(album)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while editing the album')
    }
  },

  async delete (req, res) {
    try {
      const id = req.params.id
      const username = req.user.username
      const album = await Album.findByPk(id)
      if (!album) {
        return res.status(404).send('Album not found')
      }
      if (album.fk_username === username || req.user.admin) {
        await Face.destroy({ where: { albumId: album.id } })
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
          where: {
            cancellationToken: null
          },
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
