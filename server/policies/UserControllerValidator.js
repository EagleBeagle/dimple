const Joi = require('joi')

module.exports = {
  signup (req, res, next) {
    const schema = Joi.object({
      username: Joi.string().min(4).max(25).regex(
        /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
      ),
      email: Joi.string().email().max(60),
      password: Joi.string().regex(/^(?!\$).*/).min(8).max(32)
    })
    const { error, value } = schema.validate(req.body) //  eslint-disable-line
    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          console.log(error)
          res.status(400).send({
            error: 'You must provide a valid username'
          })
          break
        case 'email':
          console.log(error)
          res.status(400).send({
            error: 'You must provide a valid email address'
          })
          break
        case 'password':
          console.log(error)
          res.status(400).send({
            error: 'The password must be at least 8 characters in length'
          })
          break
        default:
          console.log(error.details)
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
      email: Joi.string().email().max(60),
      password: Joi.string().max(32)
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
