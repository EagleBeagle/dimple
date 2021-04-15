module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    username: {
      type: Sequelize.STRING(25),
      allowNull: false,
      unique: 'username'
    },
    email: {
      type: Sequelize.STRING(60),
      allowNull: false,
      unique: 'email'
    },
    confirmationToken: {
      type: Sequelize.STRING,
      unique: 'confirmationToken'
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      unique: 'resetPasswordToken'
    },
    resetPasswordTokenExpiration: {
      type: Sequelize.DATE(6),
      defaultValue: Sequelize.NOW
    },
    avatar: {
      type: Sequelize.STRING
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
