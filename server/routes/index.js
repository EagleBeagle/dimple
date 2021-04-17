const verifyAuth = require('../policies/verifyAuth.js')
const UserController = require('../controllers/UserController.js')
const UserControllerValidator = require('../policies/UserControllerValidator.js')
const AlbumController = require('../controllers/AlbumController.js')
const ImageController = require('../controllers/ImageController.js')
const ImageControllerValidator = require('../policies/ImageControllerValidator.js')
const CommentController = require('../controllers/CommentController.js')
const multerUploads = require('../config/multer.config')

module.exports = app => {
  app.post('/signup',
    UserControllerValidator.signup,
    UserController.signup
  )

  app.post('/signin',
    UserControllerValidator.signin,
    UserController.signin)

  app.get('/user/:username',
    verifyAuth.isLoggedIn,
    UserController.get)

  app.put('/user/:username',
    verifyAuth.isLoggedIn,
    verifyAuth.isAdmin,
    UserController.update)

  app.delete('/user/:username',
    verifyAuth.isLoggedIn,
    verifyAuth.isAdmin,
    UserController.delete)

  app.put('/user/confirm/:confirmationToken',
    UserController.confirm)

  app.put('/user/forgotpassword',
    UserController.forgotPassword)

  app.put('/user/resetpassword/:resetPasswordToken',
    UserController.resetPassword)

  app.get('/user',
    verifyAuth.isLoggedIn,
    UserController.search)

  app.put('/user/:username/avatar',
    verifyAuth.isLoggedIn,
    multerUploads,
    UserController.changeAvatar)

  app.get('/admin',
    verifyAuth.isLoggedIn,
    verifyAuth.isAdmin, (req, res) => {
      res.json({ message: 'Welcome to the admin page.' })
    })

  app.post('/album',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    AlbumController.create)

  app.get('/album',
    verifyAuth.isLoggedIn,
    AlbumController.get)

  app.put('/album/:id',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    AlbumController.update)

  app.delete('/album/:id',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    AlbumController.delete)

  app.get('/album/:id/download',
    verifyAuth.isLoggedIn,
    AlbumController.download
  )

  app.post('/image',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageControllerValidator.initiateUpload,
    ImageController.initiateUpload)

  app.put('/image/:id/finalize',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageController.finalizeUpload)

  app.post('/image/:username/:imageId/cancelupload/:cancellationToken',
    ImageControllerValidator.cancelUpload,
    ImageController.cancelUpload)

  app.put('/image/:id',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageController.updateImage
  )

  app.delete('/image/:imageId',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
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
    verifyAuth.isConfirmed,
    CommentController.create
  )

  app.delete('/comment/:commentId',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    CommentController.delete
  )

  app.post('/image/:id/favourite',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageController.favourite
  )

  app.delete('/image/:id/favourite',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageController.unfavourite
  )

  app.put('/image/:id/trash',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageController.putToTrash
  )

  app.delete('/image/:id/trash',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageController.removeFromTrash
  )
}
