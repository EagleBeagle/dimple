/* eslint-disable no-unused-expressions */
const chai = require('chai')
const expect = chai.expect
const { mockRequest, mockResponse } = require('mock-req-res')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')

const db = require('../../config/db.config.js')
const Image = db.image
const User = db.user
const Comment = db.comment

const CommentController = require('../../controllers/CommentController.js')

describe('CommentController', () => {
  beforeEach(() => {
    sinon.stub(console, 'log')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('create', () => {
    it('should respond with status code 201 in case of correct comment', async () => {
      sinon.stub(Image, 'findByPk').returns({ visibility: true, fk_username: 'user1' })
      sinon.stub(Comment, 'create').returns({})
      const req = mockRequest({
        body: {
          text: 'text',
          imageId: 'image_id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.create(req, res)
      expect(res.status).to.have.been.calledWith(201)
    })

    it('should respond with status code 201 in case of correct reply', async () => {
      sinon.stub(Image, 'findByPk').returns({
        visibility: true,
        fk_username: 'user1',
        getComments: () => [{ fk_username: 'replied_user' }, { fk_username: 'user2' }]
      })
      sinon.stub(Comment, 'create').returns({})
      sinon.stub(User, 'findOne').returns({ username: 'replied_user' })
      const req = mockRequest({
        body: {
          text: 'text',
          imageId: 'image_id',
          replyTo: 'replied_user'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.create(req, res)
      expect(res.status).to.have.been.calledWith(201)
    })

    it('should respond with status code 400 if commenting to nonexistent image', async () => {
      sinon.stub(Image, 'findByPk').returns(null)
      sinon.stub(Comment, 'create').returns({})
      const req = mockRequest({
        body: {
          text: 'text',
          imageId: 'image_id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.create(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 201 in case of replying at nonexistent image', async () => {
      sinon.stub(Image, 'findByPk').returns({
        visibility: true,
        fk_username: 'user1',
        getComments: () => [{ fk_username: 'replied_user' }, { fk_username: 'user2' }]
      })
      sinon.stub(Comment, 'create').returns({})
      sinon.stub(User, 'findOne').returns(null)
      const req = mockRequest({
        body: {
          text: 'text',
          imageId: 'image_id',
          replyTo: 'replied_user'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.create(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 201 in case of replying to user with no comment', async () => {
      sinon.stub(Image, 'findByPk').returns({
        visibility: true,
        fk_username: 'user1',
        getComments: () => [{ fk_username: 'user1' }, { fk_username: 'user2' }]
      })
      sinon.stub(Comment, 'create').returns({})
      sinon.stub(User, 'findOne').returns(null)
      const req = mockRequest({
        body: {
          text: 'text',
          imageId: 'image_id',
          replyTo: 'replied_user'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.create(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 201 in case of commenting to private image', async () => {
      sinon.stub(Image, 'findByPk').returns({
        visibility: false,
        fk_username: 'user1',
        getComments: () => [{ fk_username: 'user1' }, { fk_username: 'user2' }]
      })
      sinon.stub(Comment, 'create').returns({})
      sinon.stub(User, 'findOne').returns(null)
      const req = mockRequest({
        body: {
          text: 'text',
          imageId: 'image_id',
          replyTo: 'replied_user'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.create(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of empty comment', async () => {
      sinon.stub(Image, 'findByPk').returns({ visibility: true, fk_username: 'user1' })
      sinon.stub(Comment, 'create').returns({})
      const req = mockRequest({
        body: {
          imageId: 'image_id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.create(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })

    it('should respond with status code 400 in case of no image id', async () => {
      sinon.stub(Image, 'findByPk').returns({ visibility: true, fk_username: 'user1' })
      sinon.stub(Comment, 'create').returns({})
      const req = mockRequest({
        body: {
          text: 'text'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.create(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })
  })

  describe('get', () => {
    it('should respond with status code 200 if querying correctly for comments of a photo', async () => {
      sinon.stub(Image, 'findByPk').returns({
        getComments: function () {
          return {
            reverse: () => {}
          }
        },
        countComments: () => 10,
        visibility: true
      })
      const req = mockRequest({
        query: {
          imageId: 'id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.get(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it('should respond with status code 400 if querying for comments of nonexistent photo', async () => {
      sinon.stub(Image, 'findByPk').returns(null)
      const req = mockRequest({
        query: {
          imageId: 'id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.get(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })
  })
  describe('delete', () => {
    it('should respond with status code 200 with valid params', async () => {
      sinon.stub(Comment, 'findByPk').returns({ fk_username: 'user1', destroy: () => {} })
      const req = mockRequest({
        params: {
          id: 'id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.delete(req, res)
      expect(res.status).to.have.been.calledWith(200)
    })

    it("should respond with status code 403 if trying to delete someone else's comment", async () => {
      sinon.stub(Comment, 'findByPk').returns({ fk_username: 'user2', destroy: () => {} })
      const req = mockRequest({
        params: {
          id: 'id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.delete(req, res)
      expect(res.status).to.have.been.calledWith(403)
    })

    it('should respond with status code 404 in case of nonexistent comment', async () => {
      sinon.stub(Comment, 'findByPk').returns(null)
      const req = mockRequest({
        params: {
          id: 'id'
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.delete(req, res)
      expect(res.status).to.have.been.calledWith(404)
    })

    it('should respond with status code 400 in case of missing id param', async () => {
      sinon.stub(Comment, 'findByPk').returns({ fk_username: 'user2', destroy: () => {} })
      const req = mockRequest({
        params: {
        },
        user: {
          username: 'user1'
        }
      })
      const res = mockResponse()
      await CommentController.delete(req, res)
      expect(res.status).to.have.been.calledWith(400)
    })
  })
})
