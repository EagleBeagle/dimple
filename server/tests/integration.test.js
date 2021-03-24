process.env.NODE_ENV = 'test'

describe('Integration tests', () => {
  require('./integration/UserController.js')
  require('./integration/ImageController.js')
})
