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

const UserController = require('../../controllers/UserController.js')

describe('ImageController', () => {
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
})
