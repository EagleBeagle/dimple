const db = require('../config/db.config.js')
const Op = db.Sequelize.Op
const Image = db.image
const User = db.user
const Comment = db.comment

module.exports = {
  async create (req, res) {
    try {
      const { text, replyTo, imageId } = req.body
      const queryObject = {
        text,
        imageId,
        fk_username: req.user.username
      }
      if (!text || !imageId) {
        return res.status(400).send('invalid request')
      }
      const image = await Image.findByPk(imageId)
      if (!image || (!image.visibility && image.fk_username !== req.user.username)) {
        return res.status(400).send('invalid image')
      }
      if (replyTo) {
        const comments = await image.getComments()
        if (!comments.map(comment => comment.fk_username).includes(replyTo)) {
          return res.status(400).send('replying to nonexistent comment')
        }
        const user = await User.findOne({
          where: {
            username: replyTo
          }
        })
        if (!user) {
          return res.status(400).send('replying to invalid user')
        }
        queryObject.replyTo = replyTo
      }

      const comment = await Comment.create(queryObject)
      res.status(201).send(comment)
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened during comment creation')
    }
  },

  async get (req, res) {
    try {
      const imageId = req.query.imageId
      const fromDate = req.query.from
      const toDate = req.query.to
      const limit = Number(req.query.limit)
      const admin = req.query.admin
      if (admin) {
        if (req.user.admin) {
          const comments = await Comment.findAll()
          return res.status(200).send(comments)
        } else {
          return res.status(403).send()
        }
      }
      if (!imageId) {
        return res.status(400).send('invalid image')
      }
      const queryObject = {
        where: {
          imageId
        },
        order: [
          ['createdAt', 'DESC']
        ],
        include: [{
          model: User,
          attributes: ['avatar']
        }]
      }
      if (limit) {
        queryObject.limit = limit
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
      const image = await Image.findByPk(imageId)
      if ((!image || (!image.visibility && image.fk_username !== req.user.username)) && !req.user.admin) {
        return res.status(400).send('invalid image')
      }
      const comments = await image.getComments(queryObject)
      const count = await image.countComments()
      comments.reverse()
      return res.status(200).send({ comments, count })
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened during comment retrieval')
    }
  },

  async delete (req, res) {
    try {
      const id = req.params.id
      if (!id) {
        return res.status(400).send('invalid request')
      }
      const comment = await Comment.findByPk(id)
      if (!comment) {
        return res.status(404).send('invalid comment')
      }
      if (comment.fk_username !== req.user.username && !req.user.admin) {
        return res.status(403).send('Unauthorized')
      }
      await comment.destroy()
      return res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('An error happened during comment retrieval')
    }
  }
}
