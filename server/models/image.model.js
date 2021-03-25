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
    createdAt: {
      type: Sequelize.DATE(6),
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    cancellationToken: {
      type: Sequelize.STRING
    }
  })

  return Image
}
