# express-ts-api-starter

Starter kit for an Express API with Paseto authentication written in typescript.

## Why?

This starter kit provides the flexibility of Express with the simplicity of a framework. There are dozens of great frameworks, but all have their limitations. By using Express as an unopinionated base framework, you retain complete freedom to extend it with whatever functionality that is desired.
The API is designed according to the JSON:API specification and the documentation follows the OpenAPI specification.

## Getting Started


### Installing

```
git clone https://github.com/stefanvanherwijnen/express-ts-api-starter
cd express-ts-api-starter
yarn install
cp .env.example .env
```
Create the databases:
```
touch database/database.db database/test.db
yarn configure database:migrate
```

Configure the environment variables (.env).

```
cp .env.example .env
```
Make sure to correct the .env file and finally:
```
yarn configure generate-key
yarn dev
```

Open http://127.0.0.1:3000 in the browser. API documentation is shown on http://127.0.0.1:3000/api-docs/.

## Seeding data

In order to add an 'administrator' and 'superuser' role:
```
yarn configure database:seed setup
```

To seed the database with fake users:
```
yarn configure database:seed faker
```

To create a 'demo@demo.com' user with password 'password':
```
yarn configure database:seed data
```
### Adding a role to an user

```
yarn configure user:assign-role [email] [role]
```

## Running the tests

Make sure `database/test.db` is created.

```
yarn test
```

## Available commands
```
Usage: configure [options] [command]

Options:
  -V, --version                    output the version number
  -h, --help                       output usage information

Commands:
  generate-key                     Generate a new PASETO key
  database:migrate                 Migrate database
  database:rollback                Rollback database
  database:refresh                 Refresh database
  database:seed [folder]           Seed database
  user:assign-role [email] [role]  Asign role to user
```

## Notes
The API follows the JSON API format (https://jsonapi.org/format/). Use the correct format for all requests, otherwise it will result in errors. The API documentation is automatically generated, however, a copy of the OpenAPI specification is included in swagger.json.

## Included packages
###### Key components
* [Objection.js](http://vincit.github.io/objection.js/#installation) - ORM
* [Superstruct](https://github.com/ianstormtaylor/superstruct) - Validation
* [commander](https://github.com/tj/commander.js) - Command line interface.
* [i18n](https://github.com/mashpie/i18n-node) - Translations.
* [json-api-serializer](https://github.com/danivek/json-api-serializer) - JSON API compliant data serializer.
* [paseto.js](https://github.com/sjudson/paseto.js) - PASETO authentication. Currently a forked version in anticipation of the high-level API.
* [sswagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) - Automatic Swagger documentation from JSDoc.
* [nodemailer](https://github.com/nodemailer/nodemailer) - Email

###### Development
* [jest](https://github.com/facebook/jest) - Testing
* [eslint](https://github.com/eslint/eslint) - Linting