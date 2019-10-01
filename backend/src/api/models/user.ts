import { Model, snakeCaseMappers } from 'objection'
import Role from './role'
import { superstruct } from 'superstruct'
import isEmail from 'is-email'
import JsonSerializer from '../helpers/json-serializer'
const struct = superstruct({
  types: {
    email: isEmail,
  }
})

/*
  json-api-serializer
*/
const schema = 'user'
const jsonSerializerConfig = {
  jsonapiObject: false,
  whitelistOnDeserialize: ['id', 'password', 'name', 'email'],
  unconvertCase: 'camelCase',
  convertCase: 'camelCase',
  relationships: {
    roles: {
      type: 'role',
      deserialize: (data): {id: string} => ({ id: data.id })
    }
  },
  topLevelLinks: function(data, extraData): object {
    if (extraData.topLevelLinks) {
      return {
        self: extraData.topLevelLinks.self,
        next: extraData.topLevelLinks.next,
        previous: extraData.topLevelLinks.previous,
        last: extraData.topLevelLinks.last
      }
    }
  },
  topLevelMeta: function(data, extraData): object {
    if (extraData.topLevelMeta) {
      return {
        total: extraData.topLevelMeta.total
      }
    }
  }
}
JsonSerializer.register(schema, {
  ...jsonSerializerConfig, blacklist: ['password', 'verificationToken', 'verified', 'passwordResetToken',  'tokensRevokedAt', 'createdAt', 'updatedAt']
})
JsonSerializer.register(schema, 'superuser', {
  ...jsonSerializerConfig, blacklist: ['password', 'passwordResetToken', 'createdAt', 'updatedAt'],
})

/*
  superstruct
*/
const Struct = struct({
  id: 'number|string?',
  name: 'string',
  email: 'email',
  password: 'string?',
  roles: 'object|array|null?'
})

/*
  objection
*/
// @ts-ignore
class User extends Model {
  public id?: number
  public email: string
  public name?: string
  public password: string
  public verified?: boolean
  public verificationToken?: string
  public passwordResetTokenn?: string
  public tokensRevokedAt: string
  public roles: Role[]
  public roleNames: string[]

  public static tableName = 'users'

  public static jsonSchema = {
    type: 'object',
    required: ['email'],
    properties: {
      id: { type: 'integer' },
      email: { type: 'string', format: 'email' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      password: { type: 'string' },
      verified: { type: 'boolean' },
      verificationToken: { type: 'string' },
      passwordResetToken: { type: 'string' },
      tokensRevokedAt: { type: 'string', format: 'date-time' },
      roleNames: { type: 'array' },
    },
  }

  public static relationMappings = {
    roles: {
      relation: Model.ManyToManyRelation,
      modelClass: __dirname + '/role',
      join: {
        from: 'users.id',
        through: {
          from: 'roles_roleable.user_id',
          to: 'roles_roleable.role_id',
        },
        to: 'roles.id',
      },
    },
  }

  public $afterGet(): void {
    if (this.roles) {
      this.roleNames = this.roles.map((role): string => { return role.name })
    }
  }

  public static get columnNameMappers(): object {
    return snakeCaseMappers()
  }

  public async assignRole(name): Promise<void> {
    const role = await Role.query().findOne('name', name)
    await this.$relatedQuery('roles').relate(role.id)
  }

  public async verify(): Promise<void> {
    // @ts-ignore
    await this.$query().patch({verified: true, verificationToken: '' })
  }
}

export { User as Model, schema, Struct }
export default { model: User, schema: schema, struct: Struct }
