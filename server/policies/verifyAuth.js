const db = require('../config/db.config.js')
const User = db.user
const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt

module.exports = {
  isLoggedIn (req, res, next) {
    passport.authenticate('jwt', function (err, user) {
      if (err || !user) {
        res.status(403).send({
          error: 'You do not have access to this action.'
        })
      } else {
        req.user = user
        next()
      }
    })(req, res, next)
  },

  async isAdmin (req, res, next) {
    try {
      const user = await User.findByPk(req.user.id)
      if (!user.admin) {
        return res.status(403).send('Unauthorized')
      }
      next()
    } catch (err) {
      console.log(err)
      res.status(500).send('an error happened checking for admin privilige')
    }
  },
  async attachUserObject (req, res, next) {
    passport.authenticate('jwt', function (err, user) {
      if (err) {
        res.status(500).send({
          error: 'Error during user authentication.'
        })
      } else if (!user) {
        next()
      } else {
        req.user = user
        next()
      }
    })(req, res, next)
  }
}
