const { v4: uuidv4 } = require('uuid')
const db = require('../config/db.config.js')
const Op = db.Sequelize.Op
const Image = db.image
const Album = db.album
const User = db.user
const Face = db.face
const cloudinary = require('../config/cloudinary.config.js')
const FaceDetectionService = require('../services/FaceDetectionService')

module.exports = {
  async initiateUpload (req, res) {
    try {
      const visibility = req.body.visibility
      const albums = req.body.albums
      const publicId = uuidv4()
      const cancellationToken = uuidv4()
      const image = await Image.create({
        id: publicId,
        visibility: visibility,
        fk_username: req.user.username,
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
      setTimeout(async () => {
        const updatedImage = await Image.findByPk(publicId)
        if (updatedImage && updatedImage.cancellationToken) {
          try {
            await cloudinary.uploader.destroy(`${req.user.username}/${updatedImage.id}`)
            await updatedImage.destroy()
          } catch (err) {
            console.log(err)
          }
        } else { // all the ML stuff
          await FaceDetectionService.detectFaces(image)
        }
      }, 60 * 1000 /* 65 * 60 * 1000 nem elfelejteni */)
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
      const imageId = req.params.id
      const image = await Image.findByPk(imageId)
      if (!image) {
        return res.status(404).send('Image not found')
      }
      if (image.fk_username !== req.user.username) {
        return res.status(403).send('Unauthorized')
      }
      image.cancellationToken = null
      await image.save()
      res.status(200).send()
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

  async updateImage (req, res) {
    try {
      const username = req.user.username
      const imageId = req.params.id
      const albums = req.body.albums
      const visibility = req.body.visibility
      const image = await Image.findByPk(imageId)
      if (!albums && typeof visibility === 'undefined') {
        return res.status(400).send('Invalid request')
      }
      if (!image) {
        return res.status(400).send('Invalid request')
      }
      if (image.fk_username !== username && !req.user.admin) {
        return res.status(403).send('Unauthorized')
      }
      if (albums) {
        const existingAlbums = await Album.findAll({
          where: {
            id: {
              [Op.in]: albums
            }
          }
        })
        existingAlbums.forEach(album => {
          if (album.fk_username !== username) {
            return res.status(403).send('Unauthorized')
          }
        })
        await image.setAlbums(existingAlbums)
      }

      if (typeof visibility !== 'undefined') {
        image.visibility = visibility
        await image.save()
      }

      return res.status(200).send(image)
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  },

  async deleteImage (req, res) {
    try {
      const id = req.params.id
      const username = req.user.username
      const image = await Image.findByPk(id)
      if (!image) {
        return res.status(404).send('Invalid id')
      }
      if (image.fk_username === username || req.user.admin) {
        const response = await cloudinary.uploader.destroy(`${req.user.username}/${image.id}`)
        if (response.result !== 'ok' && response.result !== 'not found') {
          return res.status(400).send('cloudinary error')
        }
        const faces = await Face.findAll({ where: { imageId: id } })
        const faceAlbums = await Album.findAll({
          where: { id: faces.map(face => face.albumId) }
        })
        await Face.destroy({ where: { imageId: id } })
        await image.destroy()
        for (let i = 0; i < faceAlbums.length; i++) {
          const faceCount = await Face.count({ where: { albumId: faceAlbums[i].id } })
          if (faceCount === 0) {
            await faceAlbums[i].destroy()
          }
        }
        return res.status(200).send()
      } else {
        return res.status(403).send('Unauthorized')
      }
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while deleting the image')
    }
  },

  async get (req, res) {
    try {
      let images
      const id = req.query.id
      const username = req.query.user
      const fromDate = req.query.from
      const toDate = req.query.to
      const albumName = req.query.album
      const limit = req.query.limit
      const sort = req.query.sort
      const visibility = req.query.visibility
      const favourites = req.query.favourites
      const trash = req.query.trash
      const explore = req.query.explore
      const admin = req.query.admin

      if (admin) {
        if (req.user.admin) {
          const images = await Image.findAll({
            attributes: {
              include: [
                [
                  db.Sequelize.literal(`(
                  SELECT COUNT(*) FROM favourites WHERE imageId = id
                )`), 'favouriteCount'
                ],
                [
                  db.Sequelize.literal(`(
                  SELECT COUNT(*) FROM comments WHERE imageId = image.id
                )`), 'commentCount'
                ]
              ]
            },
            joinTableAttributes: []
          })
          return res.status(200).send(images)
        } else {
          return res.status(403).send()
        }
      }
      const queryObject = {
        where: {
          trashed: false,
          cancellationToken: null
        },
        order: [],
        attributes: {
          include: [
            [
              db.Sequelize.literal(`(
              SELECT COUNT(*) FROM favourites WHERE imageId = id
            )`), 'favouriteCount'
            ],
            [
              db.Sequelize.literal(`(
              SELECT COUNT(*) FROM comments WHERE imageId = image.id
            )`), 'commentCount'
            ]
          ]
        }
      }
      if ((username && albumName) ||
         (username && id) ||
         (id && albumName) ||
         (!username && favourites) ||
         (albumName && favourites) ||
         (id && favourites) ||
         (trash && albumName) ||
         (trash && favourites) ||
         (trash && id) ||
         (trash && username) ||
         (trash && explore) ||
         (username && explore) || // perszonalizációnál ezt kivenni I guess
         (id && explore) ||
         (albumName && explore) ||
         (favourites && explore)) {
        return res.status(400).send('Invalid query')
      }
      if (!username && !albumName && !id && !favourites && !trash && !explore) {
        return res.status(400).send('Invalid query')
      }
      if (id) {
        queryObject.where.id = id
        images = await Image.findOne(queryObject)
        if (!images || images.cancellationToken) {
          return res.status(400).send('Invalid id')
        }
        if (images.visibility || images.fk_username === req.user.username || req.user.admin) {
          images.dataValues.favouritedByUser = await images.hasFavourite(req.user.id)
          return res.status(200).send(images)
        } else {
          return res.status(403).send('Unauthorized')
        }
      }
      if (visibility === 'true' || explore) {
        queryObject.where.visibility = 1
      } else if (visibility === 'false') {
        queryObject.where.visibility = 0
      }
      if (username && !favourites && !trash) {
        queryObject.where.fk_username = username
        if (username !== req.user.username) {
          queryObject.where.visibility = true
        }
      } else if (!username && !favourites && !explore && !albumName) {
        queryObject.where.fk_username = req.user.username
      }
      if (sort) {
        if (sort === 'date:desc') {
          queryObject.order.push(['createdAt', 'DESC'])
        } else if (sort === 'date:asc') {
          queryObject.order.push(['createdAt', 'ASC'])
        } else {
          return res.status(400).send('Invalid sort criteria')
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
        queryObject.limit = 500
      }
      if (albumName) {
        const album = await Album.findByPk(albumName)
        if (album) {
          if (album.fk_username === req.user.username || album.visibility || req.user.admin) {
            if (album.fk_username !== req.user.username) {
              queryObject.where.visibility = true
            }
            images = await album.getImages(queryObject)
          } else {
            return res.status(403).send('Unauthorized')
          }
        } else {
          return res.status(404).send('the given album does not exist')
        }
      } else if (favourites && username) {
        const user = await User.findOne({
          where: {
            username: username
          }
        })
        if (!user) {
          return res.status(404).send('User not found')
        }
        queryObject.joinTableAttributes = []
        queryObject.where.visibility = true
        images = await user.getFavourite(queryObject)
      } else if (trash) {
        queryObject.where.trashed = true
        images = await Image.findAll(queryObject)
      } else {
        images = await Image.findAll(queryObject)
      }
      /* const validImages = []
      for (let i = 0; i < images.length; i++) {
        try {
          await cloudinary.uploader.explicit(`${images[i].fk_username}/${images[i].id}`, { type: 'upload' })
          validImages.push(images[i])
        } catch {}
      } */
      res.status(200).send(images)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while fetching images')
    }
  },

  async favourite (req, res) {
    try {
      const imageId = req.params.id
      const image = await Image.findByPk(imageId)
      if (!image || image.fk_username === req.user.username) {
        return res.status(400).send('Invalid request')
      }
      await image.addFavourite(req.user.id)
      return res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while favouriting the image')
    }
  },

  async unfavourite (req, res) {
    try {
      const imageId = req.params.id
      const image = await Image.findByPk(imageId)
      if (!image || image.fk_username === req.user.username) {
        return res.status(400).send('Invalid request')
      }
      await image.removeFavourite(req.user.id)
      return res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while unfavouriting the image')
    }
  },

  async putToTrash (req, res) {
    try {
      const imageId = req.params.id
      const image = await Image.findByPk(imageId)
      if (!image || image.fk_username !== req.user.username) {
        return res.status(400).send('Invalid request')
      }
      image.trashed = true
      await image.save()
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while unfavouriting the image')
    }
  },

  async removeFromTrash (req, res) {
    try {
      const imageId = req.params.id
      const image = await Image.findByPk(imageId)
      if (!image || image.fk_username !== req.user.username) {
        return res.status(400).send('Invalid request')
      }
      image.trashed = false
      await image.save()
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while unfavouriting the image')
    }
  }
}
