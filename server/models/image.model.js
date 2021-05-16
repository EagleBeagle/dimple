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
    },
    trashed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    relevancy: {
      type: Sequelize.FLOAT,
      defaultValue: 0
    }
  })

  return Image
}
