/* eslint-disable no-unused-expressions */
const chai = require('chai')
const expect = chai.expect
const { mockRequest, mockResponse } = require('mock-req-res')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')

const db = require('../../config/db.config.js')
const User = db.user
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const emailTransporter = require('../../config/email.config.js')

const UserController = require('../../controllers/UserController.js')

describe('UserController', () => {
  beforeEach(() => {
    sinon.stub(console, 'log')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('signup', () => {
    it('should respond with status code 201 in case of no error', async () => {
      sinon.stub(bcrypt, 'hash').returns({})
      sinon.stub(User, 'create').returns({ id: '1', email: 'test@email.com', username: 'testUser' })
      sinon.stub(jwt, 'sign').returns({})
      sinon.stub(emailTransporter, 'sendMail').returns({})
      const req = mockRequest({
        body: {
          email: 'test@email.com',
          username: 'testUser',
          password: 'test_password'
        }
      })
      const res = mockResponse()
      await UserController.signup(req, res)
      expect(res.status).to.have.been.calledWith(201)
    })

    it('should respond with status code 400 in case of unavailable credentials', async () => {
      sinon.stub(bcrypt, 'hash').returns({})
      sinon.stub(User, 'create').throwsException({
        name: 'SequelizeUniqueConstraintError',
        errors: [
          {
            path: ''
          }
        ]
      })
      sinon.stub(jwt, 'sign').returns({})
      const req = mockRequest({
        body: {
          email: 'test@email.com',
          username: 'testUser',
          password: 'test_password'
        }
      })
      const res = mockResponse()
      await UserController.signup(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with corresponding message in case of unavailable email', async () => {
      sinon.stub(bcrypt, 'hash').returns({})
      sinon.stub(User, 'create').throwsException({
        name: 'SequelizeUniqueConstraintError',
        errors: [
          {
            path: 'users.email'
          }
        ]
      })
      sinon.stub(jwt, 'sign').returns({})
      const req = mockRequest({
        body: {
          email: 'test@email.com',
          username: 'testUser',
          password: 'test_password'
        }
      })
      const res = mockResponse()
      await UserController.signup(req, res)
      expect(res.send).to.have.been.calledWith('Email already in use')
    })

    it('should respond with status code 400 in case of unavailable username', async () => {
      sinon.stub(bcrypt, 'hash').returns({})
      sinon.stub(User, 'create').throwsException({
        name: 'SequelizeUniqueConstraintError',
        errors: [
          {
            path: 'users.username'
          }
        ]
      })
      sinon.stub(jwt, 'sign').returns({})
      const req = mockRequest({
        body: {
          email: 'test@email.com',
          username: 'testUser',
          password: 'test_password'
        }
      })
      const res = mockResponse()
      await UserController.signup(req, res)
      expect(res.send).to.have.been.calledWith('Username already in use')
    })

    it('should respond with status code 500 in case of database', async () => {
      sinon.stub(bcrypt, 'hash').returns({})
      sinon.stub(User, 'create').throwsException()
      sinon.stub(jwt, 'sign').returns({})
      const req = mockRequest({
        body: {
          email: 'test@email.com',
          username: 'testUser',
          password: 'test_password'
        }
      })
      const res = mockResponse()
      await UserController.signup(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })

  describe('confirm', () => {
    it('should respond with status code 200 in case of successful user confirmation', async () => {
      sinon.stub(User, 'findOne').returns({ save: () => {} })
      sinon.stub(bcrypt, 'hash').returns({})
      sinon.stub(jwt, 'sign').returns({})
      const req = mockRequest({
        params: {
          confirmationToken: 'token'
        }
      })
      const res = mockResponse()
      await UserController.confirm(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 404 in case of nonexistent user', async () => {
      sinon.stub(User, 'findOne').returns(null)
      sinon.stub(bcrypt, 'hash').returns({})
      sinon.stub(jwt, 'sign').returns({})
      const req = mockRequest({
        params: {
          confirmationToken: 'token'
        }
      })
      const res = mockResponse()
      await UserController.confirm(req, res)
      expect(res.status).to.have.been.calledWith(404)
    })

    it('should respond with status code 500 in case of database error', async () => {
      sinon.stub(User, 'findOne').throwsException()
      sinon.stub(bcrypt, 'hash').returns({})
      sinon.stub(jwt, 'sign').returns({})
      const req = mockRequest({
        params: {
          confirmationToken: 'token'
        }
      })
      const res = mockResponse()
      await UserController.confirm(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })

  describe('resetPassword', () => {
    it('should respond with status code 200 in case of correct password reset', async () => {
      sinon.stub(User, 'findOne').returns({
        resetPasswordTokenExpiration: new Date().setDate(new Date().getDate() + 1),
        save: () => {}
      })
      sinon.stub(bcrypt, 'hash').returns({})
      const req = mockRequest({
        params: {
          resetPasswordToken: 'token'
        }
      })
      const res = mockResponse()
      await UserController.resetPassword(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 400 in case of expired token', async () => {
      sinon.stub(User, 'findOne').returns({
        resetPasswordTokenExpiration: new Date().setDate(new Date().getDate() - 1),
        save: () => {}
      })
      sinon.stub(bcrypt, 'hash').returns({})
      const req = mockRequest({
        params: {
          resetPasswordToken: 'token'
        }
      })
      const res = mockResponse()
      await UserController.resetPassword(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of nonexistent user', async () => {
      sinon.stub(User, 'findOne').returns(null)
      sinon.stub(bcrypt, 'hash').returns({})
      const req = mockRequest({
        params: {
          resetPasswordToken: 'token'
        }
      })
      const res = mockResponse()
      await UserController.resetPassword(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 500 in case of database error', async () => {
      sinon.stub(User, 'findOne').throwsException()
      sinon.stub(bcrypt, 'hash').returns({})
      const req = mockRequest({
        params: {
          resetPasswordToken: 'token'
        }
      })
      const res = mockResponse()
      await UserController.resetPassword(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })
})
