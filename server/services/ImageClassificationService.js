const tf = require('@tensorflow/tfjs-node')
const { loadClassifierModel } = require('../config/machineLearning.config.js')
const { loadImage, createCanvas } = require('canvas')
const db = require('../config/db.config.js')
const Op = db.Sequelize.Op
const Album = db.album
const User = db.user

let imageClassifier
loadClassifierModel().then(loadedClassifier => {
  imageClassifier = loadedClassifier
})

const classes = [
  'Birds',
  'Boats',
  'Buildings',
  'Cars',
  'Cats',
  'Dogs',
  'Flowers',
  'Food',
  'Furniture',
  'Insects',
  'Landscapes',
  'Motorcycles',
  'Sports',
  'Trees'
]

async function makePrediction (imageUrl) {
  const image = await loadImage(imageUrl)
  const canvas = createCanvas(image.width, image.height)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  const imageTensor = tf.browser.fromPixels(canvas)
  const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [256, 256])
  const expandedImageTensor = tf.expandDims(resizedImageTensor, 0)
  return imageClassifier.predict(expandedImageTensor).dataSync()
}

function getClasses (prediction) {
  const predictedClasses = []
  for (let i = 0; i < prediction.length; i++) {
    if (prediction[i] > 0.6) {
      predictedClasses.push(classes[i])
    }
  }
  ['Birds', 'Cats', 'Dogs', 'Insects'].some(animal => {
    if (predictedClasses.includes(animal)) {
      predictedClasses.push('Animals')
      return true
    } else {
      return false
    }
  });
  ['Boats', 'Cars', 'Motorcycles'].some(vehicle => {
    if (predictedClasses.includes(vehicle)) {
      predictedClasses.push('Vehicles')
      return true
    } else {
      return false
    }
  });
  ['Flowers', 'Trees'].some(plant => {
    if (predictedClasses.includes(plant)) {
      predictedClasses.push('Plants')
      return true
    } else {
      return false
    }
  })
  return predictedClasses
}

module.exports = {
  async classifyImage (image) {
    try {
      const prediction = await makePrediction(`https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`)
      const predictedClasses = getClasses(prediction)
      for (let i = 0; i < predictedClasses.length; i++) {
        const albums = await Album.findAll({
          where: {
            name: {
              [Op.in]: [predictedClasses[i], predictedClasses[i].toLowerCase(), predictedClasses[i].toUpperCase()]
            }
          }
        })
        if (albums.length > 0) {
          for (let j = 0; j < albums.length; j++) {
            if (albums[j].name === predictedClasses[i] && albums[j].type === 'recommended') {
              await albums[j].addImage(image)
              const imageCount = await albums[j].countImages({
                where: {
                  trashed: false,
                  cancellationToken: {
                    [Op.eq]: null
                  }
                }
              })
              if (imageCount === 10) {
                const user = await User.findOne({ where: { username: image.fk_username } })
                user.notification = 'recommendation'
                await user.save()
              }
            }
          }
        } else {
          const album = await Album.create({
            name: predictedClasses[i],
            description: 'Automatically created album with photos of ' + predictedClasses[i].toLowerCase(),
            visibility: false,
            type: 'recommended',
            fk_username: image.fk_username
          })
          await album.addImage(image)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}
