const Joi = require('joi')

module.exports = {
  signup (req, res, next) {
    const schema = Joi.object({
      username: Joi.string().min(4).max(25).regex(
        /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
      ).required(),
      email: Joi.string().email().max(60).required(),
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

  signin (req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().max(60).required(),
      password: Joi.string().max(32).required()
    })
    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).send({
        error: 'invalid data'
      })
    } else {
      next()
    }
  }
}
