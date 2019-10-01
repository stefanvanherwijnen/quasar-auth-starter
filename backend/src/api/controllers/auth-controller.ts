import bcrypt from 'bcrypt'
import randomstring from 'randomstring'
import PasetoAuth from '../helpers/paseto-auth'
import { Model as User, Struct as UserStruct } from '../models/user'
import mailer from '../../common/email'
import JsonSerializer from '../helpers/json-serializer'
import databaseErrorHandler from '../helpers/database-error-handler'

/**
* @swagger
* components:
*  schemas:
*    User:
*      type: object
*      required:
*      - email
*      - password
*      - name
*      properties:
*        email:
*          type: string
*          format: email
*        password:
*          type: string
*          format: password
*          writeOnly: true
*        name:
*          type: string
*/
export class Controller {
  /**
  * @swagger
  * /auth/register:
  *  post:
  *    tags:
  *      - Authentication
  *    summary: Register an user
  *    description: Registers an user with the specified credentials
  *    requestBody:
  *      description: Optional description in *Markdown*
  *      required: true
  *      content:
  *        application/json:
  *          schema:
  *            $ref: '#/components/schemas/User'
  *    responses:
  *      '204':
  *        description: Registration succesful, user will receive an email for verification
  *      '422':
  *        $ref: '#/components/responses/ValidationError'
  *      '409':
  *        description: User already exists
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                errors:
  *                  type: array
  *                  items:
  *                    type: object
  *                    properties:
  *                      title:
  *                        type: string
  */
  public async register(req, res): Promise<void> {
    const user: {
      email: string,
      password: string,
      name: string,
      verificationToken?: string,
    } = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    }

    try {
      UserStruct(user)
    } catch (err) {
      res.status(422).send(JsonSerializer.serializeError(err))
      return
    }

    user.verificationToken = randomstring.generate(64)
    Object.assign(user, {password: await bcrypt.hash(user.password, 10)})
    // user.password = await bcrypt.hash(user.password, 10)

    User.query().insert(user).then((): void => {
      if (process.env.NODE_ENV === 'test') {
        res.send({verificationToken: user.verificationToken})
      } else {
        mailer.send({
          template: process.env.PWD + '/src/common/email/templates/verification',
          message: {
            to: user.email
          },
          locals: {
            verificationToken: user.verificationToken
          }
        }).then((): void => {
          res.status(204).send()
        })
      }
    }).catch((err): void => {
      res.status(409).send(databaseErrorHandler(err))
    })
  }

  /**
  * @swagger
  * /auth/verify:
  *  get:
  *    tags:
  *      - Authentication
  *    summary: Verify the user by token
  *    description: Finds the user associated to the provided token and verifies the user
  *    parameters:
  *      - in: query
  *        name: token
  *        schema:
  *         type: string
  *        required: true
  *        description: Verification token associated to the user
  *    responses:
  *      '200':
  *        description: Verification succesful
  *      '422':
  *        description: Invalid verification token
  */
  public async verify(req, res): Promise<void> {
    if (req.query.token)  {
      const token = req.query.token
      const user = await User.query().where('verification_token', token).where('verified', 0).first()
      if (user) {
        user.verify()
        res.status(200).send(res.__('verification.success'))
        return
      }
    }
    res.status(422).send(res.__('verification.failed'))
  }

  /**
  * @swagger
  *
  * /auth/login:
  *   post:
  *     tags:
  *       - Authentication
  *     summary: Log in as user
  *     description: Returns the user data and authentication token on succesful login
  *     requestBody:
  *       description: Optional description in *Markdown*
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               email:
  *                 type: string
  *                 format: email
  *               password:
  *                 type: string
  *     responses:
  *       '200':
  *         description: User succesfully logged in
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 user:
  *                   $ref: '#/components/schemas/User'
  *                 token:
  *                   type: string
  *       '401':
  *         description: User verification required
  *       '403':
  *         description: Invalid credentials
  */
  public async login(req, res): Promise<void>  {
    if (req.body.email && req.body.password) {
      const credentials = {email: req.body.email, password: req.body.password}


      const user = await User.query().eager('roles').findOne('email', credentials.email)
      const token = await PasetoAuth.login(user, credentials)
      if (user) {
        if (!user.verified) {
          res.status(401).send()
        }
        if (token) {
          const userJson = await JsonSerializer.serialize('user', user)

          return res.json({user: userJson, token: token})
        }
      }
    }
    res.status(403).send()
  }


  /**
  * @swagger
  * /auth/user:
  *   get:
  *     tags:
  *       - Authentication
  *     security:
  *       - PasetoAuth: []
  *     summary: Get the authorized user.
  *     description: Returns the user data of the authorized user
  *     responses:
  *       '200':
  *         description: Return the authhenticated user
  *         content:
  *           application/json:
  *             schema: 
  *               allOf:
  *                 - $ref: '#/components/schemas/User'
  *                 - type: object
  *                   properties:
  *                     id:
  *                       type: number
  *       '401':
  *         $ref: '#/components/responses/UnauthorizedError'
  */
  public async getUser(req, res): Promise<void> {
    const user: object = await PasetoAuth.getUser(req)
    res.send(await JsonSerializer.serialize('user', user))
  }

  public async passwordForgot(req, res): Promise<void> {
    try {
      if (req.body.email) {
        const token = randomstring.generate(64)
        await User.query().patch({
          // @ts-ignore
          // eslint-disable-next-line
          password_reset_token: token,
          // eslint-disable-next-line
          tokens_revoked_at: new Date().toISOString()
        }).where('email', req.body.email).throwIfNotFound()
        if (process.env.NODE_ENV === 'test') {
          res.send({passwordResetToken: token})
        } else {
          mailer.send({
            template: process.env.PWD + '/src/common/email/templates/password-forgot',
            message: {
              to: req.body.email
            },
            locals: {
              passwordResetToken: token
            }
          }).then((): void => {
            res.status(204).send()
          })
        }
      } else {
        res.status(404).send()
      }
    } catch (err) {
      res.status(err.statusCode ? err.statusCode : 400).send(JsonSerializer.serializeError(databaseErrorHandler(err)))
    }
  }

  public async passwordReset(req, res): Promise<void> {
    try {
      if (req.query.token) {
        if (req.body.password) {
          const hash = await bcrypt.hash(req.body.password, 10)
          await User.query().patch({password: hash}).where('password_reset_token', req.query.token).throwIfNotFound()
          res.status(204).send()
        } else {
          res.status(422).send()
        }
      } else {
        res.status(404).send()
      }
    } catch (err) {
      res.status(err.statusCode ? err.statusCode : 400).send(JsonSerializer.serializeError(databaseErrorHandler(err)))
    }
  }

}
export default new Controller()
