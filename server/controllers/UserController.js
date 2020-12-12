const db = require('../config/db.config.js')
const User = db.user
const jwt = require('jsonwebtoken')
const passport = require('passport')
const bcrypt = require('bcryptjs')

module.exports = {
  async signup (req, res) {
    try {
      const { email, username } = req.body
      const password = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({
        email,
        username,
        password
      })
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username
      }
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET)

      res.status(201).send({
        id: user.id,
        username,
        jwtToken
      })
    } catch (err) {
      console.log(err)
      if (err.name === 'SequelizeUniqueConstraintError') {
        if (err.errors[0].path === 'users.email') {
          res.status(400).send('Email already in use')
        } else if (err.errors[0].path === 'users.username') {
          res.status(400).send('Username already in use')
        }
      } else {
        res.status(500).send('an error happened during signup')
      }
    }
  },

  signin (req, res) {
    passport.authenticate(
      'local',
      { session: false },
      (error, user) => {
        if (error || !user) {
          return res.status(400).send({ error: 'account doesnt exist' })
        }
        const payload = {
          id: user.id,
          email: user.email,
          username: user.username
        }

        req.login(payload, { session: false }, async (error) => {
          if (error) {
            res.status(400).send({ error })
          }
          const jwtToken = jwt.sign(payload, process.env.JWT_SECRET)

          res.status(200).send({
            id: user.id,
            username: user.username,
            jwtToken
          })
        })
      }
    )(req, res)
  }
}
