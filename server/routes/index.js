const verifyAuth = require('../policies/verifyAuth.js')
const UserController = require('../controllers/UserController.js')
const UserControllerValidator = require('../policies/UserControllerValidator.js')
const AlbumController = require('../controllers/AlbumController.js')
const ImageController = require('../controllers/ImageController.js')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage
})

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

  app.put('/image',
    upload.single('image'),
    verifyAuth.isLoggedIn,
    ImageController.upload)

  app.get('/image',
    verifyAuth.isLoggedIn,
    ImageController.getImages)

  app.get('/image/:username/:filename',
    verifyAuth.attachUserObject,
    ImageController.getSingleFile)
}
