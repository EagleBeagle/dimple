const faceapi = require('@vladmandic/face-api')
const { loadImage } = require('canvas')
const db = require('../config/db.config.js')
const Op = db.Sequelize.Op
const Face = db.face
const Album = db.album
const User = db.user

module.exports = {
  async detectFaces (image) {
    try {
      const loadedImage = await loadImage(`https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`)
      const faceDescriptions = await faceapi.detectAllFaces(loadedImage).withFaceLandmarks().withFaceDescriptors()

      const facesOfUser = await db.sequelize.query('SELECT * FROM faces WHERE imageId IN (SELECT id FROM images WHERE fk_username = :fk_username)', {
        replacements: { fk_username: image.fk_username },
        type: db.Sequelize.QueryTypes.SELECT
      })

      const newFaces = []
      for (let i = 0; i < faceDescriptions.length; i++) {
        if (faceDescriptions[i].detection.score >= 0.6) {
          const face = await Face.create({
            imageId: image.id,
            descriptor: faceDescriptions[i].descriptor
          })
          newFaces.push(face)
        }
      }
      console.log('Faces detected: ' + newFaces.length)
      if (facesOfUser.length > 0) {
        const albumsAlreadyAddedTo = []
        for (let i = 0; i < newFaces.length; i++) {
          const faceMatcher = new faceapi.FaceMatcher(toFloat32Array(newFaces[i].descriptor))
          let leastDistance = 1
          let bestMatchIndex
          for (let j = 0; j < facesOfUser.length; j++) {
            const match = faceMatcher.matchDescriptor(toFloat32Array(facesOfUser[j].descriptor))
            if (match._distance < leastDistance) {
              leastDistance = match._distance
              bestMatchIndex = j
            }
          }
          if (leastDistance < 0.6) {
            newFaces[i].albumId = facesOfUser[bestMatchIndex].albumId
            await newFaces[i].save()
            if (!albumsAlreadyAddedTo.includes(newFaces[i].albumId)) {
              const faceAlbum = await Album.findByPk(newFaces[i].albumId)
              await faceAlbum.addImage(image)
              const imageCount = await faceAlbum.countImages({
                where: {
                  trashed: false,
                  cancellationToken: {
                    [Op.eq]: null
                  }
                }
              })
              if (imageCount === 2) {
                const user = await User.findOne({ where: { username: image.fk_username } })
                user.notification = 'people'
                await user.save()
              }
              albumsAlreadyAddedTo.push(newFaces[i].albumId)
            }
          } else {
            const newFaceAlbum = await Album.create({ type: 'people', visibility: false, fk_username: image.fk_username })
            await newFaceAlbum.addImage(image)
            newFaces[i].albumId = newFaceAlbum.id
            await newFaces[i].save()
          }
        }
      } else {
        for (let i = 0; i < newFaces.length; i++) {
          const newFaceAlbum = await Album.create({ type: 'people', visibility: false, fk_username: image.fk_username })
          await newFaceAlbum.addImage(image)
          newFaces[i].albumId = newFaceAlbum.id
          await newFaces[i].save()
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}

function toFloat32Array (sqlJSONDescriptor) {
  const regularArray = []
  for (let i = 0; i < 128; i++) {
    regularArray.push(sqlJSONDescriptor[i.toString()])
  }
  const float32Array = new Float32Array(128)
  float32Array.set(regularArray)
  return float32Array
}
