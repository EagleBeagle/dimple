module.exports = (sequelize, Sequelize) => {
  const Album = sequelize.define('album', {
    name: {
      type: Sequelize.STRING(25),
      allowNull: false
    },
    visibility: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(255)
    }
  })

  return Album
}
