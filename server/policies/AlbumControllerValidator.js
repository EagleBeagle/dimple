const Joi = require('joi')

module.exports = {
  create (req, res, next) {
    const schema = Joi.object({
      name: Joi.string().min(1).max(25).required(),
      description: Joi.string().max(200).allow(''),
      visibility: Joi.boolean().required()
    })
    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).send({
        error: error.details[0].message
      })
    } else {
      if (req.body.description) {
        req.body.description = req.body.description.trim()
      }
      next()
    }
  },

  get (req, res, next) {
    const schema = Joi.object({
      id: Joi.number(),
      user: Joi.string().min(4).max(25).regex(
        /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
      ),
      image: Joi.string().uuid(),
      visibility: Joi.boolean(),
      admin: Joi.boolean()
    })
    const { error } = schema.validate(req.query)
    console.log(error)
    if (error) {
      res.status(400).send({
        error: error.details[0].message
      })
    } else {
      next()
    }
  },

  update (req, res, next) {
    const paramsSchema = Joi.object({
      id: Joi.number().required()
    })
    const bodySchema = Joi.object({
      images: Joi.array().items(Joi.string().uuid()),
      visibility: Joi.boolean()
    })
    const paramsError = paramsSchema.validate(req.params)
    const bodyError = bodySchema.validate(req.body)
    if (paramsError.error) {
      res.status(400).send({
        error: 'Invalid id'
      })
    } else if (bodyError.error) {
      res.status(400).send({
        error: 'invalid data'
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
  },

  download (req, res, next) {
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
