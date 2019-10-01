import faker from 'faker'

const createFakeUser = () => (
  {
    email: faker.internet.email(),
    name: faker.name.firstName(),
    password: faker.internet.password()
  }
)
exports.seed = function(knex, Promise) {
  let fakeUsers = []
  for (let i = 0; i < 100; i++) {
    fakeUsers.push(createFakeUser())
  }
  return knex('users').insert(fakeUsers);
}
