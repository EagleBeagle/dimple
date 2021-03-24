/* eslint-disable no-unused-expressions */
const chai = require('chai')
const expect = chai.expect
const { mockRequest, mockResponse } = require('mock-req-res')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const { v4: uuidv4 } = require('uuid')

const ImageControllerValidator = require('../../policies/ImageControllerValidator.js')

describe('ImageControllerValidator.js', () => {
  beforeEach(() => {
    sinon.stub(console, 'log')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('initiateUpload', () => {
    it('should call next if input data is successfully validated', async () => {
      const req = mockRequest({
        body: {
          visibility: false,
          albums: ['album1', 'album2']
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.initiateUpload(req, res, next)
      expect(next).to.have.been.called
    })

    it('should respond with status code 400 in case of missing visibility data', async () => {
      const req = mockRequest({
        body: {
          albums: ['album1', 'album2']
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.initiateUpload(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of missing album data', async () => {
      const req = mockRequest({
        body: {
          visibility: false
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.initiateUpload(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of invalid visibility', async () => {
      const req = mockRequest({
        body: {
          visibility: 'bad data',
          albums: ['album1', 'album2']
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.initiateUpload(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with corresponding error message in case of invalid visibility', async () => {
      const req = mockRequest({
        body: {
          visibility: 'bad data',
          albums: ['album1', 'album2']
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.initiateUpload(req, res, next)
      expect(res.send).to.have.been.calledWith({
        error: 'Invalid visibility'
      })
    })

    it('should respond with status code 400 in case of invalid albums', async () => {
      const req = mockRequest({
        body: {
          visibility: false,
          albums: ['album1', 12]
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.initiateUpload(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with corresponding error message in case of invalid albums', async () => {
      const req = mockRequest({
        body: {
          visibility: false,
          albums: ['album1', 12]
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.initiateUpload(req, res, next)
      expect(res.send).to.have.been.calledWith({
        error: 'Invalid albums'
      })
    })
  })

  describe('cancelUpload', () => {
    it('should call next if input data is successfully validated', async () => {
      const req = mockRequest({
        params: {
          imageId: uuidv4(),
          username: 'testUser',
          cancellationToken: uuidv4()
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.cancelUpload(req, res, next)
      expect(next).to.have.been.called
    })

    it('should respond with status code 400 in case of invalid image id', async () => {
      const req = mockRequest({
        params: {
          imageId: 'invalid image id',
          username: 'testUser',
          cancellationToken: uuidv4()
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.cancelUpload(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of missing image id', async () => {
      const req = mockRequest({
        params: {
          username: 'testUser',
          cancellationToken: uuidv4()
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.cancelUpload(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with corresponding error message in case of invalid image id', async () => {
      const req = mockRequest({
        params: {
          imageId: 'invalid image id',
          username: 'testUser',
          cancellationToken: uuidv4()
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.cancelUpload(req, res, next)
      expect(res.send).to.have.been.calledWith({
        error: 'Invalid image id'
      })
    })

    it('should respond with status code 400 in case of invalid username', async () => {
      const req = mockRequest({
        params: {
          imageId: uuidv4(),
          username: 'abc',
          cancellationToken: uuidv4()
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.cancelUpload(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of missing username', async () => {
      const req = mockRequest({
        params: {
          imageId: 'invalid image id',
          cancellationToken: uuidv4()
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.cancelUpload(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with corresponding error message in case of invalid username', async () => {
      const req = mockRequest({
        params: {
          imageId: uuidv4(),
          username: 'abc',
          cancellationToken: uuidv4()
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.cancelUpload(req, res, next)
      expect(res.send).to.have.been.calledWith({
        error: 'Invalid username'
      })
    })

    it('should respond with status code 400 in case of invalid cancellation token', async () => {
      const req = mockRequest({
        params: {
          imageId: uuidv4(),
          username: 'testUser',
          cancellationToken: 'invalid token'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.cancelUpload(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of missing cancellation token', async () => {
      const req = mockRequest({
        params: {
          imageId: 'invalid image id',
          username: 'testUser'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.cancelUpload(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with corresponding error message in case of invalid cancellation token', async () => {
      const req = mockRequest({
        params: {
          imageId: uuidv4(),
          username: 'testUser',
          cancellationToken: 'invalid token'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.cancelUpload(req, res, next)
      expect(res.send).to.have.been.calledWith({
        error: 'Invalid cancellation token'
      })
    })
  })

  describe('deleteImage', () => {
    it('should call next if input data is successfully validated', async () => {
      const req = mockRequest({
        params: {
          imageId: uuidv4()
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.deleteImage(req, res, next)
      expect(next).to.have.been.called
    })

    it('should respond with status code 400 in case of invalid image id', async () => {
      const req = mockRequest({
        params: {
          imageId: 'invalid image id'
        }
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.deleteImage(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of missing image id', async () => {
      const req = mockRequest({
        params: {}
      })
      const next = sinon.spy()
      const res = mockResponse()
      ImageControllerValidator.deleteImage(req, res, next)
      expect(res.status).to.have.been.calledWith(400)
    })
  })
})
