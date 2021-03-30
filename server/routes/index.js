const verifyAuth = require('../policies/verifyAuth.js')
const UserController = require('../controllers/UserController.js')
const UserControllerValidator = require('../policies/UserControllerValidator.js')
const AlbumController = require('../controllers/AlbumController.js')
const ImageController = require('../controllers/ImageController.js')
const ImageControllerValidator = require('../policies/ImageControllerValidator.js')

module.exports = app => {
  app.post('/signup',
    UserControllerValidator.signup,
    UserController.signup
  )

  app.post('/signin',
    UserControllerValidator.signin,
    UserController.signin)

  app.get('/admin',
    verifyAuth.isLoggedIn,
    verifyAuth.isAdmin, (req, res) => {
      res.json({ message: 'Welcome to the admin page.' })
    })

  app.put('/album',
    verifyAuth.isLoggedIn,
    AlbumController.create)

  app.get('/album',
    verifyAuth.isLoggedIn,
    AlbumController.get)

  app.delete('/album/:id',
    verifyAuth.isLoggedIn,
    AlbumController.delete)

  app.put('/image',
    verifyAuth.isLoggedIn,
    ImageControllerValidator.initiateUpload,
    ImageController.initiateUpload)

  app.post('/image/finalize',
    verifyAuth.isLoggedIn,
    ImageController.finalizeUpload)

  app.post('/image/:username/:imageId/cancelupload/:cancellationToken',
    ImageControllerValidator.cancelUpload,
    ImageController.cancelUpload)

  app.delete('/image/:imageId',
    verifyAuth.isLoggedIn,
    ImageControllerValidator.deleteImage,
    ImageController.deleteImage)

  app.get('/image',
    verifyAuth.isLoggedIn,
    ImageControllerValidator.getImages,
    ImageController.getImages)
}
