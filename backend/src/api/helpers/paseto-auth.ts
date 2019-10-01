import bcrypt from 'bcrypt'
import { Request } from 'express'
import Paseto from 'paseto.js'
import { Model as User } from '../models/user'

import { Rules } from 'paseto.js'

class PasetoAuth {
  /**
   * Generate aa token if the user exists
   * @param  {string}} credentials [description]
   * @return {Promise}              [description]
   */
  public async login(user, credentials: {email: string, password: string}): Promise<string|boolean> {
    if (user && this.validateByCredentials(user, credentials)) {
      const token = this.generateTokenForuser(user)
      return token
    }
    return false
  }

  /**
   * Check if the email and password are correct
   * @param  {string}} credentials [description]
   * @return {boolean}              [description]
   */
  public validateByCredentials(user, credentials: {email: string, password: string}): boolean {
    return bcrypt.compareSync(credentials.password, user.password)
  }

  /**
   * Check if the request has a valid token
   * @return {Promise<boolean>} [description]
   */
  public async check(req: Request): Promise<boolean> {
    let parser = new Paseto.Parser(await this.getSharedKey())
    parser = parser.addRule(new Rules.notExpired()).addRule(new Rules.issuedBy(this.getIssuer()))
    try {
      const token = await parser.parse(this.getTokenFromRequest(req))
      Object.assign(req, {token: token})

      const id = token.getClaims().id
      const user = await User.query().eager('roles').findById(id).throwIfNotFound()
      const iat = token.getClaims().iat

      if (user) {
        if (user.tokensRevokedAt && (new Date(iat) < new Date(user.tokensRevokedAt))) {
          return false
        }
        Object.assign(req, {user: user})
      } else {
        return false
      }
    } catch (error) {
      return false
    }
    return true
  }

  /**
   * Create a token builder
   * @return {Promise<Paseto.Builder>} [description]
   */
  public async getTokenBuilder(): Promise<Paseto.Builder> {
    return new Paseto.Builder()
      .setPurpose('local')
      .setKey(await this.getSharedKey())
      .setIssuedAt(new Date())
      .setExpiration(this.getExpireTime())
      .setIssuer(this.getIssuer())
  }

  public async generateTokenForuser(user): Promise<string> {
    const claims = {
      id: user.id
    }
    const token = await this.getTokenBuilder()
    token.setClaims(claims)

    return await token.toString()
  }

  public async getSharedKey(): Promise<Paseto.SymmetricKey> {
    const sharedKey  = new Paseto.SymmetricKey(new Paseto.V2())

    return sharedKey.base64(process.env.PASETO_KEY).then((): Paseto.SymmetricKey => {
      return sharedKey
    })
  }

  public getExpireTime = (): Date => {
    const time = new Date()
    return new Date(time.setHours(time.getHours() + Number(process.env.PASETO_EXPIRE_AFTER_HOURS)))
  }

  public getIssuer = (): string => {
    return process.env.PASETO_ISSUER
  }

  public getTokenFromRequest(req): string {
    return req.header('Authorization').replace('Bearer ', '')
  }

  public async getUser(req): Promise<User> {
    let user = req.user
    const token = req.token

    if (!user) {
      if (token) {
        const claims = token.getClaims()
        user = await User.query().eager('roles').findById(claims.id).throwIfNotFound()
        Object.assign(req, {user: user})

        return user
      }
    } else {
      return user
    }
  }

  public async checkUserRole (user, role): Promise<boolean> {
    if (user) {
      user = await user.$loadRelated('roles')
      if (user.roleNames.includes(role)) {
        return true
      }
    }
    return false
  }

  public async verifyUserId (user, id, grantAccessTo = null): Promise<boolean> {
    if (grantAccessTo) {
      for (const role of grantAccessTo) {
        if (await this.checkUserRole(user, role)) {
          return true
        }
      }
    }
    if (id && user && Number(user.id) === Number(id)) {
      return true
    } else {
      const error =  new Error('Forbidden')
      error.statusCode = 403
      throw error
    }
  }
}

export default new PasetoAuth()
