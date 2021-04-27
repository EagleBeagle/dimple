module.exports = (sequelize, Sequelize) => {
  const Face = sequelize.define('face', {
    descriptor: {
      type: Sequelize.JSON,
      allowNull: false
    }
  })

  return Face
}
