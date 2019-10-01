import "../src/common/env"
import appConfig from '../src/common/server'
import routes from '../src/routes'
import supertest from 'supertest'

import randomstring from "randomstring"

var app = (new appConfig).router(routes)
var server = app.create()
let request = supertest(server)

describe('authentication', () => {
  afterAll(() => {
    app.close(server)
  })

  var verificationToken = ''
  var passwordResetToken = ''
  var token = ''
  describe('register', () => {
    const user = {
      email: 'test@test.test',
      password: 'PasswordForTTesting',
      name: 'NewUser'
    }

    it('should register an user on /auth/register', done => {
      request.post('/auth/register')
        .send(user)
        .expect(200)
        .then((response) => {
          verificationToken = response.body.verificationToken
          done()
        })
    })

    it('should succeed with correct verification token', async (done) => {
      request.get('/auth/verify?token=' + verificationToken)
        .expect(200, done)
    })

    it('should be able to login', done => {
      request.post('/auth/login')
        .send(user)
        .expect(200)
        .then((response) => {
          token = response.body.token
          done()
        })
    })

    it('should be able to visit /auth/user', done => {
      request.get('/auth/user')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject({data: {attributes: {email: 'test@test.test'}}})
          done()
        })
    })

    it('should not be able to visit /admin', done => {
      request.get('/admin')
        .set('Authorization', 'Bearer ' + token)
        .expect(403, done)
    })

    it('should not be able to visit /users', done => {
      request.get('/users')
        .set('Authorization', 'Bearer ' + token)
        .expect(403, done)
    })

    it('should be able to request a new password', done => {
      request.post('/auth/password/forgot')
        .send({email: user.email})
        .expect(200)
        .then((response) => {
          passwordResetToken = response.body.passwordResetToken
          done()
        })
    })

    it('should be able to reset the password', done => {
      request.post('/auth/password/reset?token=' + passwordResetToken)
        .send({password: 'NewPassword'})
        .expect(204, done)
    })

    it('should be able to login with the new password', done => {
      user.password = 'NewPassword'
      request.post('/auth/login')
        .send(user)
        .expect(200, done)
    })
  })

  describe('verify', () => {
    it('should fail with incorrect verification token', done => {
      request.get('/auth/verify?token=' + randomstring.generate(64))
        .expect(422)
        .then((response) => {
          done()
        })
    })
  })

  describe('login', () => {
    it('should respond with 403 when using invalid credentials', done => {
      request.post('/auth/login')
        .send({email: 'does@not.exist', password: 'invalid'})
        .expect(403)
        .then((response) => {
          done()
        })
    })
  })

  describe('authorization', () => {
    it('should not be able to visit authorized routes without a valid token', done => {
      request.get('/auth/user')
        .expect(401, done)
    })
  })

  describe('password reset', () => {
    it('should respond with 404 with an invalid email address', done => {
      request.post('/auth/password/forgot')
        .send({email: 'invalid@email.address'})
        .expect(404, done)
    })

    it('should respond with 404 with an invalid token', done => {
      request.post('/auth/password/reset?token=invalid')
        .send({password: 'NewPassword'})
        .expect(404, done)
    })

    it('should respond with 422 with a missing password', done => {
      request.post('/auth/password/reset?token=invalid')
        .expect(422, done)
    })
  })

})
