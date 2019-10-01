import bcrypt from 'bcrypt'

exports.seed = function(knex, Promise) {
  return knex('users').del()
  .then(function () {
    return knex('users').insert([
    {
      name: 'Admin test user',
      email: 'admin@demo.com',
      password: bcrypt.hashSync('password', 10),
      verified: true
    },
    {
      name: 'Normal test user',
      email: 'user@demo.com',
      password: bcrypt.hashSync('password', 10),
      verified: true
    }
    ])
  })
}
