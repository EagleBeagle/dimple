const faceapi = require('@vladmandic/face-api')
const { loadImage } = require('canvas')
const db = require('../config/db.config.js')
const Face = db.face

module.exports = {
  async detectFaces (image) {
    try {
      const loadedImage = await loadImage(`https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`)
      console.log(loadedImage)
      const faceDescriptions = await faceapi.detectAllFaces(loadedImage).withFaceLandmarks().withFaceDescriptors()
      for (let i = 0; i < faceDescriptions.length; i++) {
        console.log(faceDescriptions[i].detection.box)
        console.log(faceDescriptions[i].descriptor)
        if (faceDescriptions[i].detection.score >= 0.6) {
          const face = await Face.create({
            imageId: image.id,
            descriptor: faceDescriptions[i].descriptor
          })
          console.log(face)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}
