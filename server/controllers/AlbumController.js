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

      const queryObject = {
        where: {},
        order: [
          ['name', 'ASC']
        ]
      }

      if ((id && user) || (!id && !user)) {
        return res.status(400).send('Invalid query')
      }
      if (id) {
        const album = await Album.findByPk(req.query.id)
        if (!album) {
          return res.status(403).send('Invalid id')
        }
        if (album.fk_username === req.user.username || album.visibility) {
          return res.status(200).send(album)
        } else {
          return res.status(403).send('Unauthorized')
        }
      } else if (user) {
        queryObject.where.fk_username = user
        if (user !== req.user.username) {
          queryObject.where.visibility = true
        }
      }
      const albums = await Album.findAll(queryObject)
      for (let i = 0; i < albums.length; i++) {
        albums[i].dataValues.images = await albums[i].getImages({
          order: db.Sequelize.literal('rand()'),
          limit: 4,
          attributes: ['id'],
          joinTableAttributes: []
        })
        albums[i].dataValues.imageCount = (await albums[i].getImages({
          attributes: [
            [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'imageCount']
          ],
          joinTableAttributes: []
        }))[0].dataValues.imageCount
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
  }
}
