/* eslint-disable no-unused-expressions */
const chai = require('chai')
const expect = chai.expect
const { mockRequest, mockResponse } = require('mock-req-res')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')

const UserControllerValidator = require('../../policies/UserControllerValidator.js')

describe('UserControllerValidator.test.js', () => {
  beforeEach(() => {
    sinon.stub(console, 'log')
  })

  afterEach(() => {
    sinon.restore()
  })
  describe('signup', () => {
    it('should call next if input data is successfully validated', async () => {
      const req = mockRequest({
        body: {
          username: 'TestUser',
          email: 'test@email.com',
          password: 'valid_password'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      UserControllerValidator.signup(req, res, next)
      expect(next).to.have.been.called
    })

    it('should respond with status code 400 in case of missing username', async () => {
      const req = mockRequest({
        body: {
          email: 'test@email.com',
          password: 'valid_password'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      UserControllerValidator.signup(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of invalid username', async () => {
      const req = mockRequest({
        body: {
          username: 'abc',
          email: 'test@email.com',
          password: 'valid_password'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      UserControllerValidator.signup(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with corresponding error message in case of invalid username', async () => {
      const req = mockRequest({
        body: {
          username: 'abc',
          email: 'test@email.com',
          password: 'valid_password'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      UserControllerValidator.signup(req, res, next)
      expect(res.send).to.have.been.calledWith({
        error: 'You must provide a valid username'
      })
    })

    it('should respond with status code 400 in case of missing email', async () => {
      const req = mockRequest({
        body: {
          username: 'TestUser',
          password: 'valid_password'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      UserControllerValidator.signup(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })
    it('should respond with status code 400 in case of invalid email', async () => {
      const req = mockRequest({
        body: {
          username: 'TestUser',
          email: 'invalid email',
          password: 'valid_password'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      UserControllerValidator.signup(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with corresponding error message in case of invalid email', async () => {
      const req = mockRequest({
        body: {
          username: 'TestUser',
          email: 'invalid email',
          password: 'valid_password'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      UserControllerValidator.signup(req, res, next)
      expect(res.send).to.have.been.calledWith({
        error: 'You must provide a valid email address'
      })
    })

    it('should respond with status code 400 in case of missing password', async () => {
      const req = mockRequest({
        body: {
          username: 'TestUser',
          email: 'test@email.com'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      UserControllerValidator.signup(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of invalid password', async () => {
      const req = mockRequest({
        body: {
          username: 'TestUser',
          email: 'test@email.com',
          password: 'abc'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      UserControllerValidator.signup(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with corresponding error message in case of invalid password', async () => {
      const req = mockRequest({
        body: {
          username: 'TestUser',
          email: 'test@email.com',
          password: 'abc'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      UserControllerValidator.signup(req, res, next)
      expect(res.send).to.have.been.calledWith({
        error: 'The password must be at least 8 characters in length and must not contain special characters'
      })
    })
  })
})
