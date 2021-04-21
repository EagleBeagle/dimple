const Joi = require('joi')

module.exports = {
  create (req, res, next) {
    const schema = Joi.object({
      text: Joi.string().min(1).max(100).required(),
      imageId: Joi.string().uuid().required(),
      replyTo: Joi.string().min(4).max(25).regex(
        /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
      )
    })
    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).send({
        error: 'Invalid comment data'
      })
    } else {
      req.body.text = req.body.text.trim()
      next()
    }
  },

  get (req, res, next) {
    const schema = Joi.object({
      imageId: Joi.string().uuid(),
      from: Joi.date().less('now'),
      to: Joi.date().less('now'),
      limit: Joi.number(),
      admin: Joi.boolean()
    })
    const { error } = schema.validate(req.query)
    if (error) {
      res.status(400).send({
        error: error.details[0].message
      })
    } else {
      next()
    }
  },

  delete (req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      res.status(400).send({
        error: 'Invalid id'
      })
    } else {
      next()
    }
  }
}
