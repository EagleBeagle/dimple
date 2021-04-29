require('@tensorflow/tfjs-node')
const canvas = require('canvas')
const faceapi = require('@vladmandic/face-api')

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

module.exports = {
  async loadModels () {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('public/models/ssd_mobilenetv1_model-shard1')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('public/models/face_landmark_68')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('public/models/face_recognition')

    /* PRODUCTION
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('/app/server/public/models/ssd_mobilenetv1_model-shard1')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('/app/server/public/models/face_landmark_68')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('/app/server/public/models/face_recognition') */
  }
}
