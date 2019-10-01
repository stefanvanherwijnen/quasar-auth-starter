exports.seed = function(knex, Promise) {
  return knex('roles').del()
  .then(function () {
        return knex('roles').insert([
        {
          name: 'administrator'
        },
        {
          name: 'superuser'
        }
        ])
      })
}
