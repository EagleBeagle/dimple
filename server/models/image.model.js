module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define('image', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    visibility: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    cancellationToken: {
      type: Sequelize.STRING
    }
  })

  return Image
}
