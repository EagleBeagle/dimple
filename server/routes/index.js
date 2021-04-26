const verifyAuth = require('../policies/verifyAuth.js')
const UserController = require('../controllers/UserController.js')
const UserControllerValidator = require('../policies/UserControllerValidator.js')
const AlbumController = require('../controllers/AlbumController.js')
const AlbumControllerValidator = require('../policies/AlbumControllerValidator.js')
const ImageController = require('../controllers/ImageController.js')
const ImageControllerValidator = require('../policies/ImageControllerValidator.js')
const CommentController = require('../controllers/CommentController.js')
const CommentControllerValidator = require('../policies/CommentControllerValidator.js')
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
    UserControllerValidator.get,
    UserController.get)

  app.put('/user/:username',
    verifyAuth.isLoggedIn,
    verifyAuth.isAdmin,
    UserControllerValidator.update,
    UserController.update)

  app.delete('/user/:username',
    verifyAuth.isLoggedIn,
    verifyAuth.isAdmin,
    UserControllerValidator.delete,
    UserController.delete)

  app.put('/user/confirm/:confirmationToken',
    UserControllerValidator.confirm,
    UserController.confirm)

  app.put('/user/forgotpassword',
    UserControllerValidator.forgotPassword,
    UserController.forgotPassword)

  app.put('/user/resetpassword/:resetPasswordToken',
    UserControllerValidator.resetPassword,
    UserController.resetPassword)

  app.get('/user',
    verifyAuth.isLoggedIn,
    UserControllerValidator.search,
    UserController.search)

  app.put('/user/:username/avatar',
    verifyAuth.isLoggedIn,
    multerUploads,
    UserControllerValidator.changeAvatar,
    UserController.changeAvatar)

  app.get('/admin',
    verifyAuth.isLoggedIn,
    verifyAuth.isAdmin,
    UserController.getAdminInfo)

  app.post('/album',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    AlbumControllerValidator.create,
    AlbumController.create)

  app.get('/album',
    verifyAuth.isLoggedIn,
    AlbumControllerValidator.get,
    AlbumController.get)

  app.put('/album/:id',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    AlbumControllerValidator.update,
    AlbumController.update)

  app.delete('/album/:id',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    AlbumControllerValidator.delete,
    AlbumController.delete)

  app.get('/album/:id/download',
    verifyAuth.isLoggedIn,
    AlbumControllerValidator.download,
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
    ImageControllerValidator.finalizeUpload,
    ImageController.finalizeUpload)

  app.post('/image/:username/:imageId/cancelupload/:cancellationToken',
    ImageControllerValidator.cancelUpload,
    ImageController.cancelUpload)

  app.put('/image/:id',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageControllerValidator.updateImage,
    ImageController.updateImage
  )

  app.delete('/image/:id',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageControllerValidator.deleteImage,
    ImageController.deleteImage)

  app.get('/image',
    verifyAuth.isLoggedIn,
    ImageControllerValidator.get,
    ImageController.get)

  app.get('/comment',
    verifyAuth.isLoggedIn,
    CommentControllerValidator.get,
    CommentController.get
  )

  app.post('/comment',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    CommentControllerValidator.create,
    CommentController.create
  )

  app.delete('/comment/:id',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    CommentControllerValidator.delete,
    CommentController.delete
  )

  app.post('/image/:id/favourite',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageControllerValidator.favourite,
    ImageController.favourite
  )

  app.delete('/image/:id/favourite',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageControllerValidator.favourite,
    ImageController.unfavourite
  )

  app.put('/image/:id/trash',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageControllerValidator.trash,
    ImageController.putToTrash
  )

  app.delete('/image/:id/trash',
    verifyAuth.isLoggedIn,
    verifyAuth.isConfirmed,
    ImageControllerValidator.trash,
    ImageController.removeFromTrash
  )
}
