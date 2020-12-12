module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    username: {
      type: Sequelize.STRING(25),
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING(60),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })

  return User
}
