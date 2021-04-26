/* eslint-disable no-unused-expressions */
const chai = require('chai')
const expect = chai.expect
const { mockRequest, mockResponse } = require('mock-req-res')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')

const db = require('../../config/db.config.js')
const Image = db.image
const Album = db.album
const cloudinary = require('../../config/cloudinary.config.js')

const ImageController = require('../../controllers/ImageController.js')

describe('ImageController', () => {
  beforeEach(() => {
    sinon.stub(console, 'log')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('initiateUpload', () => {
    it('should respond with status code 201 in case of no error', async () => {
      sinon.stub(Image, 'create').returns({ addAlbums: () => {} })
      sinon.stub(Album, 'findAll').returns([])
      sinon.stub(cloudinary.utils, 'api_sign_request').returns({})
      const req = mockRequest({
        body: {
          visibility: false,
          albums: ['album1', 'album2']
        },
        user: {
          id: '1'
        }
      })
      const res = mockResponse()
      await ImageController.initiateUpload(req, res)
      expect(res.status).to.have.been.calledWith(201)
    })

    it('should respond with status code 500 in case of cloudinary error', async () => {
      sinon.stub(Image, 'create').returns({ addAlbums: () => {} })
      sinon.stub(Album, 'findAll').returns([])
      sinon.stub(cloudinary.utils, 'api_sign_request').throwsException()
      const req = mockRequest({
        body: {
          visibility: false,
          albums: ['album1', 'album2']
        },
        user: {
          id: '1'
        }
      })
      const res = mockResponse()
      await ImageController.initiateUpload(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })

    it('should respond with status code 500 in case of database error', async () => {
      sinon.stub(Image, 'create').throwsException()
      sinon.stub(Album, 'findAll').returns([])
      sinon.stub(cloudinary.utils, 'api_sign_request').returns({})
      const req = mockRequest({
        body: {
          visibility: false,
          albums: ['album1', 'album2']
        },
        user: {
          id: '1'
        }
      })
      const res = mockResponse()
      await ImageController.initiateUpload(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })

  describe('cancelUpload', () => {
    it('should respond with status code 200 in case of no error', async () => {
      sinon.stub(Image, 'findByPk').returns({ cancellationToken: 'token', destroy: () => {} })
      sinon.stub(cloudinary.api, 'resource').throwsException()
      const req = mockRequest({
        params: {
          imageId: '1',
          username: ['album1', 'album2'],
          cancellationToken: 'token'
        }
      })
      const res = mockResponse()
      await ImageController.cancelUpload(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 400 in case of non-existent image', async () => {
      sinon.stub(Image, 'findByPk').returns(undefined)
      sinon.stub(cloudinary.api, 'resource').throwsException()
      const req = mockRequest({
        params: {
          imageId: '1',
          username: ['album1', 'album2'],
          cancellationToken: 'token'
        }
      })
      const res = mockResponse()
      await ImageController.cancelUpload(req, res)
      expect(res.status).to.have.been.calledWith(404)
    })

    it('should respond with status code 403 if the cancellation tokens do not match', async () => {
      sinon.stub(Image, 'findByPk').returns({ cancellationToken: 'token', destroy: () => {} })
      sinon.stub(cloudinary.api, 'resource').throwsException()
      const req = mockRequest({
        params: {
          imageId: '1',
          username: ['album1', 'album2'],
          cancellationToken: 'other token'
        }
      })
      const res = mockResponse()
      await ImageController.cancelUpload(req, res)
      expect(res.status).to.have.been.calledWith(403)
    })

    it('should respond with status code 400 in case the image is saved and so the upload cannot be cancelled', async () => {
      sinon.stub(Image, 'findByPk').returns({ cancellationToken: 'token', destroy: () => {} })
      sinon.stub(cloudinary.api, 'resource').returns({})
      const req = mockRequest({
        params: {
          imageId: '1',
          username: ['album1', 'album2'],
          cancellationToken: 'token'
        }
      })
      const res = mockResponse()
      await ImageController.cancelUpload(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 500 in case database error', async () => {
      sinon.stub(Image, 'findByPk').throwsException()
      sinon.stub(cloudinary.api, 'resource').throwsException()
      const req = mockRequest({
        params: {
          imageId: '1',
          username: ['album1', 'album2'],
          cancellationToken: 'token'
        }
      })
      const res = mockResponse()
      await ImageController.cancelUpload(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })

  describe('deleteImage', () => {
    it('should respond with status code 200 in case of no error', async () => {
      sinon.stub(Image, 'findByPk').returns({ cancellationToken: 'token', userId: '2', destroy: () => {} })
      sinon.stub(cloudinary.uploader, 'destroy').returns({ result: 'ok' })
      const req = mockRequest({
        params: {
          id: '1'
        },
        user: {
          id: '2'
        }
      })
      const res = mockResponse()
      await ImageController.deleteImage(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 400 in case of non-existent image', async () => {
      sinon.stub(Image, 'findByPk').returns(undefined)
      sinon.stub(cloudinary.uploader, 'destroy').returns({ result: 'ok' })
      const req = mockRequest({
        params: {
          imageId: '1'
        },
        user: {
          id: '2'
        }
      })
      const res = mockResponse()
      await ImageController.deleteImage(req, res)
      expect(res.status).to.have.been.calledWith(404)
    })

    it('should respond with status code 403 if the user is unauthorized for deletion', async () => {
      sinon.stub(Image, 'findByPk').returns({ cancellationToken: 'token', fk_username: 'user1', destroy: () => {} })
      sinon.stub(cloudinary.uploader, 'destroy').returns({ result: 'ok' })
      const req = mockRequest({
        params: {
          imageId: '1'
        },
        user: {
          username: 'another_user'
        }
      })
      const res = mockResponse()
      await ImageController.deleteImage(req, res)
      expect(res.status).to.have.been.calledWith(403)
    })

    it('should respond with status code 400 in case of cloudinary deletion error', async () => {
      sinon.stub(Image, 'findByPk').returns({ cancellationToken: 'token', userId: '2', destroy: () => {} })
      sinon.stub(cloudinary.uploader, 'destroy').returns({ result: 'not ok' })
      const req = mockRequest({
        params: {
          imageId: '1'
        },
        user: {
          id: '2'
        }
      })
      const res = mockResponse()
      await ImageController.deleteImage(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 500 in case of database deletion error', async () => {
      sinon.stub(Image, 'findByPk').throwsException()
      sinon.stub(cloudinary.uploader, 'destroy').returns({ result: 'ok' })
      const req = mockRequest({
        params: {
          imageId: '1'
        },
        user: {
          id: '2'
        }
      })
      const res = mockResponse()
      await ImageController.deleteImage(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })

  describe('get', () => {
    it('should respond with status code 200 if querying correctly for user photos', async () => {
      sinon.stub(Image, 'findAll').returns({})
      const req = mockRequest({
        user: {
          username: 'user1'
        },
        query: {
          user: 'user1',
          sort: 'date:desc'
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 400 if using incorrect query format for user photos', async () => {
      sinon.stub(Image, 'findAll').returns({})
      const req = mockRequest({
        user: {
          id: '1'
        },
        query: {
          user: 'user1',
          album: 'album1'
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 200 if querying correctly for user favourites', async () => {
      sinon.stub(Image, 'findAll').returns({})
      const req = mockRequest({
        user: {
          username: 'user1'
        },
        query: {
          user: 'user1',
          sort: 'date:desc',
          favourite: true
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 400 if using incorrect query format for user favourites', async () => {
      sinon.stub(Image, 'findAll').returns({})
      const req = mockRequest({
        user: {
          id: '1'
        },
        query: {
          user: 'user1',
          album: 'album1',
          favourites: true
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 200 if querying correctly for an album', async () => {
      sinon.stub(Image, 'findAll').returns({})
      sinon.stub(Album, 'findByPk').returns({ fk_username: 'user1', getImages: () => {} })
      const req = mockRequest({
        query: {
          album: 'album1'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 200 if querying for own private album', async () => {
      sinon.stub(Image, 'findAll').returns({})
      sinon.stub(Album, 'findByPk').returns({ fk_username: 'user1', getImages: () => {}, visibility: false })
      const req = mockRequest({
        query: {
          album: 'album1'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it("should respond with status code 403 if querying for someone else's private album", async () => {
      sinon.stub(Image, 'findAll').returns({})
      sinon.stub(Album, 'findByPk').returns({ fk_username: 'user1', getImages: () => {}, visibility: false })
      const req = mockRequest({
        query: {
          album: 'album1'
        },
        user: {
          username: 'user2'
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(403)
    })

    it('should respond with status code 200 if querying for own private photo', async () => {
      sinon.stub(Image, 'findOne').returns({
        visibility: false,
        fk_username: 'user1',
        dataValues: {},
        hasFavourite: () => {}
      })
      const req = mockRequest({
        query: {
          id: 'photo id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it("should respond with status code 403 if querying for someone else's private photo", async () => {
      sinon.stub(Image, 'findOne').returns({
        visibility: false,
        fk_username: 'user1',
        dataValues: {},
        hasFavourite: () => {}
      })
      const req = mockRequest({
        query: {
          id: 'photo id'
        },
        user: {
          username: 'user2'
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(403)
    })

    it("should respond with status code 403 if querying for someone else's private photo", async () => {
      sinon.stub(Image, 'findAll').returns({})
      sinon.stub(Album, 'findByPk').returns({ fk_username: 'user1', getImages: () => {}, visibility: false })
      const req = mockRequest({
        query: {
          album: 'album1'
        },
        user: {
          username: 'user2'
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(403)
    })

    it('should respond with status code 500 in case of database error', async () => {
      sinon.stub(Image, 'findAll').throwsException()
      const req = mockRequest({
        user: {
          username: 'user1'
        },
        query: {
          user: 'user1',
          sort: 'date:desc'
        }
      })
      const res = mockResponse()
      await ImageController.get(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })
})
