const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
require('dotenv').config()
// production: const path = require('path')
const history = require('connect-history-api-fallback')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'))
}
app.use(history())
// production: app.use(express.static(path.join(__dirname, '../dist')))

require('./config/passport.js')
require('./config/db.config.js')

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

require('./routes')(app)

module.exports = app
