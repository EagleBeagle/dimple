const request = require('supertest')
const app = require('../../server.js')
const sinon = require('sinon')
const db = require('../../config/db.config.js')
const Image = db.image
const Comment = db.comment

describe('CommentController', () => {
  let token
  let imageId

  before(async function () {
    const user = {
      email: 'test@email.com',
      password: 'test_password'
    }
    const userRes = await request(app)
      .post('/signin')
      .send(user)

    token = userRes.body.jwtToken

    const imageRes = await request(app)
      .post('/image')
      .set('Authorization', 'Bearer ' + token)
      .send({
        visibility: true,
        albums: []
      })
    imageId = imageRes.body.publicId
  })

  beforeEach(() => {
    sinon.stub(console, 'log')
  })

  afterEach(() => {
    sinon.restore()
  })

  after(async () => {
    await Image.destroy({
      where: {
        id: imageId
      }
    })
  })

  describe('POST /comment', () => {
    it('should respond with status code 201 if params are correct', async () => {
      await request(app)
        .post('/comment')
        .set('Authorization', 'Bearer ' + token)
        .send({
          text: 'comment text',
          imageId: imageId
        })
        .expect(201)
    })

    it('should respond with status code 403 in case of no authorization', async () => {
      await request(app)
        .post('/comment')
        .send({
          text: 'comment text',
          imageId: imageId
        })
        .expect(403)
    })

    it('should respond with status code 403 in case of no invalid image id', async () => {
      await request(app)
        .post('/comment')
        .send({
          text: 'comment text',
          imageId: 'bad'
        })
        .expect(403)
    })

    it('should respond with status code 400 in case of missing image id', async () => {
      await request(app)
        .post('/comment')
        .set('Authorization', 'Bearer ' + token)
        .send({
          text: 'comment text'
        })
        .expect(400)
    })

    it('should respond with status code 400 in case of missing text', async () => {
      await request(app)
        .post('/comment')
        .set('Authorization', 'Bearer ' + token)
        .send({
          imageId: imageId
        })
        .expect(400)
    })

    it('should respond with status code 400 in case of empty string as text', async () => {
      await request(app)
        .post('/comment')
        .set('Authorization', 'Bearer ' + token)
        .send({
          text: '',
          imageId: imageId
        })
        .expect(400)
    })
    it('should respond with status code 400 in case of replying to user with no related comment', async () => {
      await request(app)
        .post('/comment')
        .set('Authorization', 'Bearer ' + token)
        .send({
          text: 'comment text',
          imageId,
          replyTo: 'badUser'
        })
        .expect(400)
    })
  })
  describe('DELETE /comment/:id', () => {
    it('should respond with status code 200 if comment id param is correct', async () => {
      const comment = await Comment.create({
        text: 'comment text',
        fk_username: 'testUser',
        imageId
      })
      await request(app)
        .delete(`/comment/${comment.id}`)
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(200)
    })
    it('should respond with status code 404 if comment is not found', async () => {
      await request(app)
        .delete('/comment/9999999999')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(404)
    })
  })
})
