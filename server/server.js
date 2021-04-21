const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const Ddos = require('ddos')
require('dotenv').config()

const app = express()

const corsOptions = {
  origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'))
}

const ddos = new Ddos({ burst: 10, limit: 100 })
app.use(ddos.express)

require('./config/passport.js')
require('./config/db.config.js')

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

require('./routes')(app)

module.exports = app
