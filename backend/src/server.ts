import './common/env'
import Server from './common/server'
import routes from './routes'

export default new Server()
  .swaggerUi()
  .logger()
  .router(routes)
  .listen(process.env.PORT)
