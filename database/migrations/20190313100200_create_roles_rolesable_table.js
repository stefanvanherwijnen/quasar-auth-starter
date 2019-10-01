exports.up = function(knex, Promise) {
  return knex.schema.createTable('roles_roleable', function(table) {
    table.primary(['role_id', 'user_id'])
    table.integer('role_id').notNullable().unsigned().references('roles.id').onDelete('CASCADE')
    table.integer('user_id').notNullable().unsigned().references('users.id').onDelete('CASCADE')
    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  knex.schema.table('roles_roleable', function (table) {
    table.dropForeign('role_id')
    table.dropForeign('user_id')
  })
  return knex.schema.dropTable('roles_roleable')
}
