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

const AlbumController = require('../../controllers/AlbumController.js')
const cloudinary = require('../../config/cloudinary.config.js')

describe('AlbumController', () => {
  beforeEach(() => {
    sinon.stub(console, 'log')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('create', () => {
    it('should respond with status code 201 in case of correct params', async () => {
      sinon.stub(Album, 'create').returns({})
      const req = mockRequest({
        body: {
          text: 'name',
          description: 'description',
          visibility: true
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.create(req, res)
      expect(res.status).to.have.been.calledWith(201)
    })

    it('should respond with status code 500 in case of database error', async () => {
      sinon.stub(Album, 'create').throwsException()
      const req = mockRequest({
        body: {
          text: 'name',
          description: 'description',
          visibility: true
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.create(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })

  describe('get', () => {
    it('should respond with status code 200 if querying correctly for user albums', async () => {
      sinon.stub(Album, 'findAll').returns([])
      const req = mockRequest({
        query: {
          user: 'user1'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.get(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 200 if querying correctly for albums of a photo', async () => {
      sinon.stub(Image, 'findByPk').returns({ fk_username: 'user1', getAlbums: () => [] })
      const req = mockRequest({
        query: {
          image: 'image1'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.get(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 200 if querying correctly for an exact public album', async () => {
      sinon.stub(Album, 'findOne').returns({ fk_username: 'user1', dataValues: {}, countImages: () => [] })
      const req = mockRequest({
        query: {
          id: 'album id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.get(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 404 if querying correctly for a nonexistent album', async () => {
      sinon.stub(Album, 'findOne').returns(null)
      const req = mockRequest({
        query: {
          id: 'album id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.get(req, res)
      expect(res.status).to.have.been.calledWith(404)
    })

    it('should respond with status code 200 if querying correctly for own private album', async () => {
      sinon.stub(Album, 'findOne').returns({ fk_username: 'user1', dataValues: {}, countImages: () => [] })
      const req = mockRequest({
        query: {
          id: 'album id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.get(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it("should respond with status code 403 if querying correctly for someone else's private album", async () => {
      sinon.stub(Album, 'findOne').returns({ fk_username: 'user1', dataValues: {}, countImages: () => [] })
      const req = mockRequest({
        query: {
          id: 'album id'
        },
        user: {
          username: 'user2'
        }
      })
      const res = mockResponse()
      await AlbumController.get(req, res)
      expect(res.status).to.have.been.calledWith(403)
    })

    it('should respond with status code 400 if using wrong combination of params', async () => {
      sinon.stub(Album, 'findAll').returns([])
      const req = mockRequest({
        query: {
          user: 'user1',
          image: 'image1'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.get(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })
  })

  describe('update', () => {
    it('should respond with status code 400 in case of missing params', async () => {
      sinon.stub(Album, 'findByPk').returns({})
      const req = mockRequest({
        body: {
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.update(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 404 in case of nonexistent album', async () => {
      sinon.stub(Album, 'findByPk').returns(null)
      const req = mockRequest({
        body: {
          visibility: true
        },
        params: {
          albumId: 'id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.update(req, res)
      expect(res.status).to.have.been.calledWith(404)
    })

    it("should respond with status code 403 if trying to update someone else's album", async () => {
      sinon.stub(Album, 'findByPk').returns({ fk_username: 'user1' })
      const req = mockRequest({
        body: {
          visibility: true
        },
        params: {
          albumId: 'id'
        },
        user: {
          username: 'user2'
        }
      })
      const res = mockResponse()
      await AlbumController.update(req, res)
      expect(res.status).to.have.been.calledWith(403)
    })

    it('should respond with status code 200 if correctly updating containing photos', async () => {
      sinon.stub(Album, 'findByPk').returns({ fk_username: 'user1', addImages: () => {}, save: () => {} })
      const req = mockRequest({
        body: {
          images: ['image1']
        },
        params: {
          albumId: 'id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.update(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 200 if correctly updating visibility', async () => {
      sinon.stub(Album, 'findByPk').returns({ fk_username: 'user1', addImages: () => {}, save: () => {} })
      const req = mockRequest({
        body: {
          visibility: true
        },
        params: {
          albumId: 'id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.update(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 500 in case of database error', async () => {
      sinon.stub(Album, 'findByPk').throwsException()
      const req = mockRequest({
        body: {
          visibility: true
        },
        params: {
          albumId: 'id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.update(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })

  describe('delete', () => {
    it('should respond with status code 200 in case of correct params', async () => {
      sinon.stub(Album, 'findByPk').returns({ fk_username: 'user1', destroy: () => {} })
      const req = mockRequest({
        body: {
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.delete(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 404 if no album was found', async () => {
      sinon.stub(Album, 'findByPk').returns(null)
      const req = mockRequest({
        body: {
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.delete(req, res)
      expect(res.status).to.have.been.calledWith(404)
    })

    it("should respond with status code 403 if trying to delete someone else's album", async () => {
      sinon.stub(Album, 'findByPk').returns({ fk_username: 'user1', destroy: () => {} })
      const req = mockRequest({
        body: {
        },
        user: {
          username: 'user2'
        }
      })
      const res = mockResponse()
      await AlbumController.delete(req, res)
      expect(res.status).to.have.been.calledWith(403)
    })

    it('should respond with status code 500 in case of database error', async () => {
      sinon.stub(Album, 'findByPk').throwsException()
      const req = mockRequest({
        body: {
        },
        user: {
          username: 'user2'
        }
      })
      const res = mockResponse()
      await AlbumController.delete(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })

  describe('download', () => {
    it('should respond with status code 200 in case of successful retrieval of a public album', async () => {
      sinon.stub(Album, 'findByPk').returns({
        fk_username: 'user1',
        getImages: () => []
      })
      sinon.stub(cloudinary.utils, 'download_zip_url').returns('')
      const req = mockRequest({
        body: {
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.download(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 200 in case of successful retrieval of own private album', async () => {
      sinon.stub(Album, 'findByPk').returns({
        fk_username: 'user1',
        visibility: false,
        getImages: () => []
      })
      sinon.stub(cloudinary.utils, 'download_zip_url').returns('')
      const req = mockRequest({
        body: {
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await AlbumController.download(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it("should respond with status code 403 if trying to retrieve someone else's private album", async () => {
      sinon.stub(Album, 'findByPk').returns({
        fk_username: 'user1',
        visibility: false,
        getImages: () => []
      })
      sinon.stub(cloudinary.utils, 'download_zip_url').returns('')
      const req = mockRequest({
        body: {
        },
        user: {
          username: 'user2'
        }
      })
      const res = mockResponse()
      await AlbumController.download(req, res)
      expect(res.status).to.have.been.calledWith(403)
    })

    it('should respond with status code 500 in case of database error', async () => {
      sinon.stub(Album, 'findByPk').throwsException()
      const req = mockRequest({
        body: {
        },
        user: {
          username: 'user2'
        }
      })
      const res = mockResponse()
      await AlbumController.download(req, res)
      expect(res.status).to.have.been.calledWith(500)
    })
  })
})
