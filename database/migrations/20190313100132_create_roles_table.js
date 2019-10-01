exports.up = function(knex, Promise) {
  return knex.schema.createTable('roles', function(table) {
    table.increments('id').primary()
    table.string('name').nullable().unique()
    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('roles');
}
