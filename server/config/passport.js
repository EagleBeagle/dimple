const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt
const bcrypt = require('bcryptjs')
const db = require('./db.config.js')
const User = db.user

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({
      where: {
        email
      }
    })

    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (passwordsMatch) {
      return done(null, user)
    } else {
      return done('Incorrect username or password')
    }
  } catch (error) {
    console.log(error)
    done(error)
  }
}))

passport.use(
  new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'dimple_jwt_secret'
  }, async function (jwtPayload, done) {
    try {
      const user = await User.findByPk(jwtPayload.id)
      if (!user) {
        return done(new Error(), false)
      }
      return done(null, user)
    } catch (err) {
      console.log(err)
      return done(new Error(), false)
    }
  })
)
