const request = require('supertest')
const app = require('../../server.js')
const sinon = require('sinon')

describe('UserController', () => {
  beforeEach(() => {
    sinon.stub(console, 'log')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('POST /signup', () => {
    const user = {
      email: 'test@email.com',
      username: 'testUser',
      password: 'test_password'
    }
    const invalidUser = {
      email: 'bad email',
      username: 'testUser',
      password: 'test_password'
    }
    const incompleteUser = {
      username: 'testUser',
      password: 'test_password'
    }

    it('should respond with status code 201 in case of successful signup', async () => {
      await request(app)
        .post('/signup')
        .send(user)
        .expect(201)
    })
    it('should respond with status code 400 if credentials already in use', async () => {
      await request(app)
        .post('/signup')
        .send(user)
        .expect(400)
    })
    it('should respond with status code 400 in case of invalid data', async () => {
      await request(app)
        .post('/signup')
        .send(invalidUser)
        .expect(400)
    })
    it('should respond with status code 400 in case of missing data', async () => {
      await request(app)
        .post('/signup')
        .send(incompleteUser)
        .expect(400)
    })
  })
  describe('POST /signin', () => {
    const user = {
      email: 'test@email.com',
      password: 'test_password'
    }
    const unknownUser = {
      email: 'anotherTest@email.com',
      password: 'test_password'
    }
    const incompleteUser = {
      username: 'testUser2'
    }
    it('should respond with status code 201 in case of successful login', async () => {
      await request(app)
        .post('/signin')
        .send(user)
        .expect(200)
    })
    it('should respond with status code 400 if authentication failed', async () => {
      await request(app)
        .post('/signin')
        .send(unknownUser)
        .expect(400)
    })
    it('should respond with status code 400 in case of missing data', async () => {
      await request(app)
        .post('/signup')
        .send(incompleteUser)
        .expect(400)
    })
  })
})
