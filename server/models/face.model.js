module.exports = (sequelize, Sequelize) => {
  const Face = sequelize.define('face', {
    descriptor: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })

  return Face
}
