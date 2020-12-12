const db = require('../config/db.config.js')
const Album = db.album

module.exports = {
  async create (req, res) {
    try {
      const { name, description, visibility } = req.body
      const userId = req.user.id
      const album = await Album.create({
        name,
        description,
        visibility,
        userId
      })
      res.status(201).send(album)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened during album creation')
    }
  },

  async get (req, res) {
    try {
      if (req.query.id) {
        const album = await Album.findByPk(req.query.id)
        res.status(200).send(album)
      } else {
        const albums = await Album.findAll({
          where: {
            userId: req.user.id
          }
        })
        res.status(200).send(albums)
      }
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened while fetching the albums')
    }
  }
}
