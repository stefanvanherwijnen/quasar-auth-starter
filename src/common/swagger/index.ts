import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExpressTS Api Starter',
      version: '0.1.0',
      description: 'Starter kit for an ExpressJS API in TypeScript with Paseto authentication'
    },
  },
  // Path to the API docs
  apis: ['src/api/controllers/*.ts', 'src/routes.ts'],
}
const swaggerSpec = swaggerJSDoc(options)

export default function (app): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {swaggerUrl: '/swagger.json'}))
  app.get('/swagger.json', (req, res): void => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
