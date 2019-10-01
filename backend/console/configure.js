#!/usr/bin/env babel-node --
import program from 'commander'
import fs from 'fs'
import envfile from 'envfile'
import { V2 as encoder, SymmetricKey} from 'paseto.js'
import Knex from 'knex'
import { Model } from 'objection'

const sourcePath = '.env'
let env = envfile.parseFileSync(sourcePath)

const knexConfig = require('../knexfile')
const knex = Knex(knexConfig[env.APP_ENV])
Model.knex(knex)

import User from '../src/api/models/user.ts'

const generateNewKey = async () => {
  try {
    let sk = new SymmetricKey(new encoder)
    sk.generate().then(() => {
      let b64 = sk.encode() 
      env.PASETO_KEY = b64
      let output = envfile.stringifySync(env)
      fs.writeFileSync(sourcePath, output)
      console.log('New PASETO key has been sucessfully generated.')
    });
  } catch (err) {
    throw err
  }
}

const databaseFunctions = async (method, argument) => {
  switch (method) {
    case 'rollback':
      await knex.migrate.rollback({}, true)
      console.log('Database has been rolled back')
      break
    case 'migrate':
      await knex.migrate.latest()
      console.log('Database has been migrated')
      break
    case 'refresh':
      await knex.migrate.rollback({}, true)
      await knex.migrate.latest()
      console.log('Database has been refreshed')
      break
    case 'seed':
      let config = knexConfig[env.APP_ENV]
      if (argument) {
        console.log('Seeding from folder: ' + argument)
        let pathArray = config.seeds.directory.split('/')
        pathArray[pathArray.length - 1] = argument
        config.seeds.directory = pathArray.join('/')
      }
      await knex.seed.run(config)
      console.log('Database has been seeded')
      break
    default:
      console.log('No method specified')
  }
  knex.destroy()
}

const assignRole = async (email, roleName) => {
  let user
  try {
    user = await User.query().findOne('email', email).throwIfNotFound()
    await user.assignRole(roleName)
  } catch (err) {
    console.error(err)
    knex.destroy()
    return
  }
  knex.destroy()
  console.log('Role successfully added')
}

program
  .version('0.0.1')
  .command('generate-key')
  .description('Generate a new PASETO key')
  .action(generateNewKey)

program
  .command('database:migrate')
  .description('Migrate database')
  .action(function() {
    databaseFunctions('migrate')
  })

program
  .command('database:rollback')
  .description('Rollback database')
  .action(function() {
    databaseFunctions('rollback')
  })

program
  .command('database:refresh')
  .description('Refresh database')
  .action(function() {
    databaseFunctions('refresh')
  })

program
  .command('database:seed [folder]')
  .description('Seed database')
  .action(function(folder) {
    databaseFunctions('seed', folder)
  })

program
  .command('user:assign-role [email] [role]')
  .description('Asign role to user')
  .action(function(email, role) {
    assignRole(email, role)
  })

program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

program.parse(process.argv);