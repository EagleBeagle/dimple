const Joi = require('joi')

module.exports = {
  initiateUpload (req, res, next) {
    const schema = Joi.object({
      visibility: Joi.boolean().required(),
      albums: Joi.array().items(Joi.string().max(25)).required()
    })
    const { error } = schema.validate(req.body)
    if (error) {
      console.log(error)
      switch (error.details[0].context.key) {
        case 'visibility':
          res.status(400).send({
            error: 'Invalid visibility'
          })
          break
        default:
          res.status(400).send({
            error: 'Invalid albums'
          })
      }
    } else {
      next()
    }
  },

  finalizeUpload (req, res, next) {
    const schema = Joi.object({
      id: Joi.string().uuid().required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      console.log(error)
      res.status(400).send({
        error: 'Invalid image id'
      })
    } else {
      next()
    }
  },

  cancelUpload (req, res, next) {
    const schema = Joi.object({
      imageId: Joi.string().uuid().required(),
      username: Joi.string().min(4).max(25).required(),
      cancellationToken: Joi.string().uuid().required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      switch (error.details[0].context.key) {
        case 'imageId':
          res.status(400).send({
            error: 'Invalid image id'
          })
          break
        case 'username':
          res.status(400).send({
            error: 'Invalid username'
          })
          break
        case 'cancellationToken':
          res.status(400).send({
            error: 'Invalid cancellation token'
          })
      }
    } else {
      next()
    }
  },

  updateImage (req, res, next) {
    const paramsSchema = Joi.object({
      id: Joi.string().uuid().required()
    })
    const bodySchema = Joi.object({
      albums: Joi.array().items(Joi.number()),
      visibility: Joi.boolean()
    })
    const paramsError = paramsSchema.validate(req.params)
    const bodyError = bodySchema.validate(req.body)
    if (paramsError.error) {
      res.status(400).send({
        error: 'Invalid image id'
      })
    } else if (bodyError.error) {
      res.status(400).send({
        error: 'Invalid update values'
      })
    } else {
      next()
    }
  },

  deleteImage (req, res, next) {
    const schema = Joi.object({
      id: Joi.string().uuid().required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      res.status(400).send({
        error: 'Invalid image id'
      })
    } else {
      next()
    }
  },

  get (req, res, next) {
    const schema = Joi.object({
      from: Joi.date().less('now'),
      to: Joi.date().less('now'),
      album: Joi.number(),
      limit: Joi.number().max(500),
      sort: Joi.string().valid('date:desc', 'date:asc', 'relevancy'),
      user: Joi.string().min(4).max(25),
      id: Joi.string().uuid(),
      favourites: Joi.boolean(),
      trash: Joi.boolean(),
      visibility: Joi.boolean(),
      explore: Joi.boolean(),
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

  favourite (req, res, next) {
    const schema = Joi.object({
      id: Joi.string().uuid().required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      res.status(400).send({
        error: 'Invalid image id'
      })
    } else {
      next()
    }
  },

  trash (req, res, next) {
    const schema = Joi.object({
      id: Joi.string().uuid().required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      res.status(400).send({
        error: 'Invalid image id'
      })
    } else {
      next()
    }
  }
}
