import bodyParser from 'body-parser'
import Express from 'express'
import * as http from 'http'
import Knex from 'knex'
import { Model } from 'objection'
import * as os from 'os'
import * as path from 'path'
import knexConfig from '../../knexfile'
import l from './logger'
import swagger from './swagger'
import morgan from 'morgan'
import cors from 'cors'

import i18n from 'i18n'
i18n.configure({
  locales: ['en', 'nl'],
  defaultLocale: 'nl',
  register: global,
  objectNotation: true,
  syncFiles: true,
  directory: __dirname + '/../i18n',
})

const env = process.env.NODE_ENV || process.env.APP_ENV
const knex = Knex(knexConfig[env])
Model.knex(knex)

const app = Express()

export default class ExpressServer {
  public constructor() {
    const root = path.normalize(`${__dirname}/../..`)
    app.set('appPath', `${root}client`)
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }))
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }))
    app.use(Express.static(`${root}/public`))
    app.use(i18n.init)
    app.use(cors())
  }

  public swaggerUi(): ExpressServer {
    swagger(app)
    return this
  }

  public logger (): ExpressServer {
    app.use(morgan('combined'))
    return this
  }

  public router(routes): ExpressServer {
    routes(app)
    return this
  }

  public listen(port = process.env.PORT): http.Server {
    const welcome: Function = (p: string): void => l.info(`Up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${p}}`)

    const server = http.createServer(app).listen(port, welcome(port))
    return server
  }

  public create(): Express.Express {
    return app
  }

  public async close (): Promise<void> {
    await knex.destroy()
    return
  }
}
