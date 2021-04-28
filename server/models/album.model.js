module.exports = (sequelize, Sequelize) => {
  const Album = sequelize.define('album', {
    name: {
      type: Sequelize.STRING(25)
    },
    visibility: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(200)
    },
    type: {
      type: Sequelize.STRING
    }
  })

  return Album
}
