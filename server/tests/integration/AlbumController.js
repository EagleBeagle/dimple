const request = require('supertest')
const app = require('../../server.js')
const sinon = require('sinon')
const db = require('../../config/db.config.js')
const Image = db.image
const Album = db.album

describe('AlbumController', () => {
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

  describe('POST /album', () => {
    it('should respond with status code 201 if params are correct', async () => {
      await request(app)
        .post('/album')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'album1',
          description: 'this is a test album',
          visibility: true
        })
        .expect(201)
    })

    it('should respond with status code 400 if name is missing', async () => {
      await request(app)
        .post('/album')
        .set('Authorization', 'Bearer ' + token)
        .send({
          description: 'this is a test album',
          visibility: true
        })
        .expect(400)
    })

    it('should respond with status code 400 if visibility is missing', async () => {
      await request(app)
        .post('/album')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'album1',
          description: 'this is a test album'
        })
        .expect(400)
    })

    it('should respond with status code 403 in case of no authorization', async () => {
      await request(app)
        .post('/album')
        .send({
          name: 'album1',
          description: 'this is a test album',
          visibility: true
        })
        .expect(403)
    })
  })
  describe('GET /album', () => {
    it('should respond with status code 200 if querying correctly for albums of an image', async () => {
      await request(app)
        .get(`/album?image=${imageId}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'album1',
          description: 'this is a test album',
          visibility: true
        })
        .expect(200)
    })
    it('should respond with status code 200 if querying correctly for a specific album', async () => {
      const album = await Album.create({
        name: 'album1',
        visibility: true,
        fk_username: 'testUser'
      })
      await request(app)
        .get(`/album?id=${album.id}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'album1',
          description: 'this is a test album',
          visibility: true
        })
        .expect(200)
    })
    it('should respond with status code 404 if querying for a nonexistent album', async () => {
      await request(app)
        .get('/album?id=999999')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'album1',
          description: 'this is a test album',
          visibility: true
        })
        .expect(404)
    })
  })
  describe('DELETE /album', () => {
    it('should respond with status code 200 if correctly deleting an album', async () => {
      const album = await Album.create({
        name: 'album1',
        visibility: true,
        fk_username: 'testUser'
      })
      await request(app)
        .delete(`/album/${album.id}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'album1',
          description: 'this is a test album',
          visibility: true
        })
        .expect(200)
    })
    it('should respond with status code 403 if trying to delete an album unauthorized', async () => {
      const album = await Album.create({
        name: 'album1',
        visibility: true,
        fk_username: 'testUser'
      })
      await request(app)
        .delete(`/album/${album.id}`)
        .send({
          name: 'album1',
          description: 'this is a test album',
          visibility: true
        })
        .expect(403)
    })
    it('should respond with status code 404 if trying to delete a nonexistent album', async () => {
      await request(app)
        .delete('/album/999999999')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'album1',
          description: 'this is a test album',
          visibility: true
        })
        .expect(404)
    })
  })
})
