let Knex = require('knex')
const knexConfig = require('../../knexfile')
let config = knexConfig[process.env.NODE_ENV]
const knex = Knex(config)

module.exports = async () => {
  process.env.APP_ENV = process.env.NODE_ENV
  await knex.migrate.rollback()
  await knex.migrate.latest()
  await knex.seed.run()

  // Seed data
  let pathArray = config.seeds.directory.split('/')
  pathArray[pathArray.length - 1] = 'data'
  config.seeds.directory = pathArray.join('/')
  await knex.seed.run(config)

  await knex.destroy()
}
