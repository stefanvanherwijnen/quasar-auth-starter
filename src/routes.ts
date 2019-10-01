import express from 'express'
import JsonSerializer from './api/helpers/json-serializer'

import authMiddleware from './api/middleware/auth'
import roleMiddleware from './api/middleware/roles'

import AuthController from './api/controllers/auth-controller'

import { index, create, read, update, deletion } from './api/controllers/json-api-controller'
import User from './api/models/user'

async function jsonApiPayload (req, res, next): Promise<void> {
  if (Object.prototype.hasOwnProperty.call(req.body, 'data')) {
    next()
  } else {
    res.status(422).send(JsonSerializer.serializeError(new Error('JSON API format required.')))
  }
}

function JsonApiRoutes (resource): express.Router {
  return express.Router()
    .get('/', index(resource.model, resource.schema))
    .post('/', jsonApiPayload, create(resource.model, resource.schema, resource.struct))
    .get('/:id', read(resource.model, resource.schema))
    .patch('/', jsonApiPayload, update(resource.model, resource.schema, resource.struct))
    .delete('/:id', deletion(resource.model))
}

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    PasetoAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: Paseto    # optional, arbitrary value for documentation purposes
 *
 *  responses:
 *    UnauthorizedError:
 *      description: Access token is missing or invalid
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              errors:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *
 *    ValidationError:
 *      description: Validation error
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              errors:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                    detail:
 *                      type: string
 *
 *    ForbiddenError:
 *      description: User does not have the correct permissions
 */

const authRoutes = express.Router()
  .post('/login', AuthController.login)
  .post('/register', AuthController.register)
  .get('/verify', AuthController.verify)
  .get('/user', authMiddleware, AuthController.getUser)
  .post('/password/forgot', AuthController.passwordForgot)
  .post('/password/reset', AuthController.passwordReset)


export default function routes(app): void {
  app.use('/auth', authRoutes)
  app.use('/users', authMiddleware, roleMiddleware(['superuser']), JsonApiRoutes(User))
  app.use('/admin', authMiddleware, roleMiddleware(['administrator']), (res, req): void => {res.send('Administrator')})
}
