const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.LOCAL_DATABASE_URL, {
  dialect: 'mysql',
  operatorsAliases: '0',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const db = {}

sequelize.authenticate().then(() => {
  console.log('Database connection established successfully')
}).catch(() => {
  console.error('An error occured during database connection')
})

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('../models/user.model.js')(sequelize, Sequelize)
db.album = require('../models/album.model.js')(sequelize, Sequelize)
db.image = require('../models/image.model.js')(sequelize, Sequelize)

db.user.hasMany(db.album)
db.user.hasMany(db.image)
db.image.belongsToMany(db.album, { through: 'AlbumImage' })
db.album.belongsToMany(db.image, { through: 'AlbumImage' })

db.sequelize.sync({
  alter: true
})
module.exports = db
