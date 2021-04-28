const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  operatorsAliases: '0',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
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
db.comment = require('../models/comment.model.js')(sequelize, Sequelize)
db.face = require('../models/face.model.js')(sequelize, Sequelize)

db.user.hasMany(db.album)
db.album.belongsTo(db.user, {
  foreignKey: {
    name: 'fk_username',
    allowNull: false
  },
  targetKey: 'username'
})

db.user.hasMany(db.image)
db.image.belongsTo(db.user, {
  foreignKey: {
    name: 'fk_username',
    allowNull: false
  },
  targetKey: 'username'
})

db.image.belongsToMany(db.album, { through: 'AlbumImage' })
db.album.belongsToMany(db.image, { through: 'AlbumImage' })

db.user.hasMany(db.comment)
db.comment.belongsTo(db.user, {
  foreignKey: {
    name: 'fk_username',
    allowNull: false
  },
  targetKey: 'username'
})

db.image.hasMany(db.comment, { onDelete: 'cascade' })
db.comment.belongsTo(db.image)

db.image.belongsToMany(db.user, { as: 'favourite', through: 'favourites' })
db.user.belongsToMany(db.image, { as: 'favourite', through: 'favourites' })

db.image.hasMany(db.face)
db.face.belongsTo(db.image, { onDelete: 'CASCADE' })

db.album.hasMany(db.face)
db.face.belongsTo(db.album)

db.sequelize.sync({
  alter: true
})
module.exports = db
