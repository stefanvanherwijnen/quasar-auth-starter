import { Model } from 'objection'

import JsonSerializer from '../helpers/json-serializer'

JsonSerializer.register('role', {
  jsonapiObject: false,
  whitelistOnDeserialize: ['id', 'name']
})

// @ts-ignore
export default class Role extends Model {
  public readonly id?: number
  public name?: string

  public static tableName = 'roles'

  public static relationMappings = {
    user: {
      join: {
        from: 'roles.id',
        through: {
          from: 'roles_roleable.role_id',
          to: 'roles_roleable.user_id',
        },
        to: 'users.id',
      },
      modelClass: __dirname + '/user',
      relation: Model.HasOneRelation,
    },
  }
}
