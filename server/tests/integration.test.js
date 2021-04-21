process.env.NODE_ENV = 'test'
const db = require('../config/db.config.js')
const User = db.user
const Image = db.image
const Album = db.album

describe('Integration tests', () => {
  require('./integration/UserController.js')
  require('./integration/ImageController.js')
  require('./integration/CommentController.js')
  require('./integration/AlbumController.js')

  after(async () => {
    await Image.destroy({
      where: {
        fk_username: 'testUser'
      }
    })
    await Album.destroy({
      where: {
        fk_username: 'testUser'
      }
    })
    await User.destroy({
      where: {
        username: 'testUser'
      }
    })
  })
})
