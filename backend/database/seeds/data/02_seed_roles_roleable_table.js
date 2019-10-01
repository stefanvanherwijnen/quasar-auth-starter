exports.seed = function(knex, Promise) {
  return knex('roles_roleable').del()
  .then(function () {
    return knex('roles_roleable').insert([
    {
      role_id: 1,
      user_id: 1
    },
    {
      role_id: 2,
      user_id: 1
    }
    ])
  })
}
