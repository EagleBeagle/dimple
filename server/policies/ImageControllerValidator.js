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

  deleteImage (req, res, next) {
    const schema = Joi.object({
      imageId: Joi.string().uuid().required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      console.log('FOS', req.params.imageId)
      res.status(400).send({
        error: 'Invalid image id'
      })
    } else {
      next()
    }
  }
}
