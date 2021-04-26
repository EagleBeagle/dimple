const request = require('supertest')
const app = require('../../server.js')
const sinon = require('sinon')
const db = require('../../config/db.config.js')
const User = db.user

describe('ImageController', () => {
  let token
  let imageId

  before(function (done) {
    const user = {
      email: 'test@email.com',
      password: 'test_password'
    }
    request(app)
      .post('/signin')
      .send(user)
      .end(function (err, res) {
        token = res.body.jwtToken
        done(err)
      })
  })

  beforeEach(() => {
    sinon.stub(console, 'log')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('POST /image', () => {
    const body = {
      visibility: false,
      albums: []
    }
    const incompleteBody = {
      albums: ['album1']
    }
    const bodyInvalidAlbums = {
      visibility: false,
      albums: ['waytooolongalbumnaaaaaaaaaaaaaame']
    }

    it('should respond with status code 403 if user is not logged in', async () => {
      await request(app)
        .post('/image')
        .send(body)
        .expect(403)
    })

    it('should respond with status code 403 if user is not confirmed', async () => {
      await request(app)
        .post('/image')
        .send(body)
        .expect(403)
    })

    it('should respond with status code 201 in case of succesful image record creation', async () => {
      await User.update({ confirmationToken: null }, {
        where: {
          username: 'testUser'
        }
      })
      const res = await request(app)
        .post('/image')
        .set('Authorization', 'Bearer ' + token)
        .send(body)
        .expect(201)
      imageId = res.body.publicId
    })
    it('should respond with status code 400 in case of incomplete data', async () => {
      await request(app)
        .post('/image')
        .set('Authorization', 'Bearer ' + token)
        .send(incompleteBody)
        .expect(400)
    })
    it('should respond with status code 400 in case of invalid data', async () => {
      await request(app)
        .post('/image')
        .set('Authorization', 'Bearer ' + token)
        .send(bodyInvalidAlbums)
        .expect(400)
    })
  })

  describe('DELETE /image/:id', () => {
    it('should respond with status code 403 if user is not logged in', async () => {
      await request(app)
        .delete('/image/something')
        .expect(403)
    })
    it('should respond with status code 200 in case of succesful deletion', async () => {
      await request(app)
        .delete(`/image/${imageId}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
    })
    it('should respond with status code 400 in case of invalid id', async () => {
      await request(app)
        .delete('/image/asd')
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
    })
    it('should respond with status code 404 in case of missing id', async () => {
      await request(app)
        .delete('/image')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
    })
  })
})
