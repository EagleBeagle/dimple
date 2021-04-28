const Joi = require('joi')

module.exports = {
  signup (req, res, next) {
    const schema = Joi.object({
      username: Joi.string().min(4).max(25).regex(
        /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
      ).required(),
      email: Joi.string().email().max(320).required(),
      password: Joi.string().regex(/^(?!\$).*/).min(8).max(32).required()
    })
    const { error } = schema.validate(req.body)
    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            error: 'You must provide a valid username'
          })
          break
        case 'email':
          res.status(400).send({
            error: 'You must provide a valid email address'
          })
          break
        case 'password':
          res.status(400).send({
            error: 'The password must be at least 8 characters in length and must not contain special characters'
          })
          break
        default:
          res.status(400).send({
            error: 'Invalid registration information'
          })
      }
    } else {
      next()
    }
  },

  confirm (req, res, next) {
    const schema = Joi.object({
      confirmationToken: Joi.string().uuid().required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      res.status(400).send({
        error: 'Invalid confirmation token'
      })
    } else {
      next()
    }
  },

  signin (req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().max(320).required(),
      password: Joi.string().regex(/^(?!\$).*/).min(8).max(32).required()
    })
    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).send({
        error: 'invalid data'
      })
    } else {
      next()
    }
  },

  forgotPassword (req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().max(320).required()
    })
    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).send({
        error: 'Invalid email'
      })
    } else {
      next()
    }
  },

  resetPassword (req, res, next) {
    const schema = Joi.object({
      resetPasswordToken: Joi.string().uuid().required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      res.status(400).send({
        error: 'Invalid reset token'
      })
    } else {
      next()
    }
  },

  update (req, res, next) {
    const paramsSchema = Joi.object({
      username: Joi.string().min(4).max(25).regex(
        /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
      ).required()
    })
    const bodySchema = Joi.object({
      admin: Joi.boolean(),
      notification: Joi.string().valid('people', '') // notificaiton típusok
    })
    const paramsError = paramsSchema.validate(req.params)
    const bodyError = bodySchema.validate(req.body)
    if (paramsError.error) {
      res.status(400).send({
        error: 'Invalid username'
      })
    } else if (bodyError.error) {
      res.status(400).send({
        error: 'Invalid data'
      })
    } else {
      next()
    }
  },

  delete (req, res, next) {
    const schema = Joi.object({
      username: Joi.string().min(4).max(25).regex(
        /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
      ).required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      res.status(400).send({
        error: 'Invalid username'
      })
    } else {
      next()
    }
  },

  changeAvatar (req, res, next) {
    const schema = Joi.object({
      username: Joi.string().min(4).max(25).regex(
        /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
      ).required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      res.status(400).send({
        error: 'Invalid username'
      })
    } else if (!req.file) {
      res.status(400).send('invalid or missing image file')
    } else {
      next()
    }
  },

  get (req, res, next) {
    const schema = Joi.object({
      username: Joi.string().min(4).max(25).regex(
        /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
      ).required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
      res.status(400).send({
        error: 'Invalid username'
      })
    } else {
      next()
    }
  },

  search (req, res, next) {
    const schema = Joi.object({
      search: Joi.string().allow(''),
      admin: Joi.boolean(),
      limit: Joi.number()
    })
    const { error } = schema.validate(req.query)
    console.log(error)
    if (error) {
      res.status(400).send({
        error: 'Invalid search'
      })
    } else {
      next()
    }
  }
}
