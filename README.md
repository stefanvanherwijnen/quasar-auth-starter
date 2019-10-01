# Quasar Auth Starter

## Warning

Do not use this repository in production. Instead, follow the steps below to make sure you generated a new PASETO key.

## Setup

Run `yarn install` in both the `frontend` as `backend` directory. Start the frontend with `quasar dev` and the backend with `yarn dev`.
You can now login with `user@demo.com` or `admin@demo.com` with password `password`.

## Recreate

Steps to recreate:

- `quasar create frontend`
- `cd frontend`
- `quasar ext add auth-token-based`, and edit MyLayout.vue
- `quasar dev`

In a different window:

- `git submodule add https://github.com/stefanvanherwijnen/express-ts-api-starter backend`
- `cd backend`
- `yarn install`
- `cp .env.example .env`
- `touch database.db`
- `yarn configure database:migrate`
- `yarn configure database:seed`
- `yarn configure database seed data`
- `yarn configure generate-key`
- `yarn dev`
