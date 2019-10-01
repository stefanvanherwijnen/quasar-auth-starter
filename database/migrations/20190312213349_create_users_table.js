exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary()
    table.string('name').nullable()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.boolean('verified').defaultTo(false)
    table.string('verification_token').nullable()
    table.string('password_reset_token').nullable()
    table.datetime('tokens_revoked_at').nullable()
    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
