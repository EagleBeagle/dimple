const verifyAuth = require('../policies/verifyAuth.js')
const UserController = require('../controllers/UserController.js')
const UserControllerValidator = require('../policies/UserControllerValidator.js')
const AlbumController = require('../controllers/AlbumController.js')
const ImageController = require('../controllers/ImageController.js')
const ImageControllerValidator = require('../policies/ImageControllerValidator.js')
const CommentController = require('../controllers/CommentController.js')

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

  app.post('/album',
    verifyAuth.isLoggedIn,
    AlbumController.create)

  app.get('/album',
    verifyAuth.isLoggedIn,
    AlbumController.get)

  app.delete('/album/:id',
    verifyAuth.isLoggedIn,
    AlbumController.delete)

  app.get('/album/:id/download',
    verifyAuth.isLoggedIn,
    AlbumController.download
  )

  app.post('/image',
    verifyAuth.isLoggedIn,
    ImageControllerValidator.initiateUpload,
    ImageController.initiateUpload)

  app.post('/image/finalize',
    verifyAuth.isLoggedIn,
    ImageController.finalizeUpload)

  app.post('/image/:username/:imageId/cancelupload/:cancellationToken',
    ImageControllerValidator.cancelUpload,
    ImageController.cancelUpload)

  app.put('/image/:id',
    verifyAuth.isLoggedIn,
    ImageController.updateImage
  )

  app.delete('/image/:imageId',
    verifyAuth.isLoggedIn,
    ImageControllerValidator.deleteImage,
    ImageController.deleteImage)

  app.get('/image',
    verifyAuth.isLoggedIn,
    ImageControllerValidator.getImages,
    ImageController.getImages)

  app.get('/comment',
    verifyAuth.isLoggedIn,
    CommentController.get
  )

  app.post('/comment',
    verifyAuth.isLoggedIn,
    CommentController.create
  )

  app.delete('/comment/:commentId',
    verifyAuth.isLoggedIn,
    CommentController.delete
  )
}
