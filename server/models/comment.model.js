module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define('comment', {
    text: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    replyTo: {
      type: Sequelize.STRING(25)
    },
    createdAt: {
      type: Sequelize.DATE(6),
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  })

  return Comment
}
