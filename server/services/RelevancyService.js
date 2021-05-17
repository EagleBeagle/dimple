const db = require('../config/db.config.js')
const Op = db.Sequelize.Op
const Image = db.image

function calculateRelevancy (image) {
  const dateNow = new Date()
  const hoursPassedSinceCreation = (dateNow - image.createdAt) / (60 * 60 * 1000)
  const score = image.dataValues.favouriteCount
  return score + 1 / Math.pow(hoursPassedSinceCreation, 1.8)
}

async function updateRelevancyScores () {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const images = await Image.findAll({
    where: {
      createdAt: {
        [Op.gt]: oneWeekAgo
      }
    },
    attributes: {
      include: [
        [
          db.Sequelize.literal(`(
          SELECT COUNT(*) FROM favourites WHERE imageId = id
        )`), 'favouriteCount'
        ]
      ]
    }
  })
  for (let i = 0; i < images.length; i++) {
    images[i].relevancy = calculateRelevancy(images[i])
    await images[i].save()
  }
}

module.exports = {
  async startUpdating () {
    setInterval(async () => {
      await updateRelevancyScores()
    }, 5000) // 6 * 60 * 60 * 1000
  },
  calculateRelevancy
}
