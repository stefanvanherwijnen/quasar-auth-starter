import JsonSerializer from '../helpers/json-serializer'
import databaseErrorHandler from '../helpers/database-error-handler'
import { serialize, paginate, createResource, readResource, patchResource, deleteResource } from '../helpers/json-api'

function index(model, schema): Function {
  return async (req, res): Promise<void> => {
    try {
      const results = await paginate(req, model, { user: req.user })
      res.send(await serialize(req, results, schema))
    } catch (err) {
      const error = databaseErrorHandler(err)
      res.status(error.statusCode ? error.statusCode : 400).send(JsonSerializer.serializeError(error))
    }
  }
}

function create(model, schema, struct): Function {
  return async (req, res): Promise<void> => {
    try {
      const data = await JsonSerializer.deserializeAsync(schema, req.body)
      try {
        struct(data)
      } catch (err) {
        res.status(422).send(JsonSerializer.serializeError(err))
        return
      }
      const result = await createResource(req, model, data, { user: req.user })
      res.send(await serialize(req, result, schema))
    } catch (err) {
      const error = databaseErrorHandler(err)
      res.status(error.statusCode ? error.statusCode : 400).send(JsonSerializer.serializeError(error))
    }
  }
}

function read(model, schema): Function {
  return async (req, res): Promise<void> => {
    try {
      const result = await readResource(req, model, { user: req.user })
      res.send(await serialize(req, result, schema))
    } catch (err) {
      const error = databaseErrorHandler(err)
      res.status(error.statusCode ? error.statusCode : 400).send(JsonSerializer.serializeError(error))
    }
  }
}

function update(model, schema, struct): Function {
  return async (req, res): Promise<void> => {
    try {
      const data = await JsonSerializer.deserializeAsync(schema, req.body)
      try {
        struct(data)
      } catch (err) {
        res.status(422).send(JsonSerializer.serializeError(err))
        return
      }
      const result = await patchResource(req, model, data, { user: req.user }, {relate: true, unrelate: true, noRelate: true, noUnrelate: true})
      res.send(await serialize(req, result, schema))
    } catch (err) {
      const error = databaseErrorHandler(err)
      res.status(error.statusCode ? error.statusCode : 400).send(JsonSerializer.serializeError(error))
    }
  }
}

function deletion(model): Function {
  return async (req, res): Promise<void> => {
    try {
      const deleted = await deleteResource(req, model, { user: req.user })
      if (deleted) {
        res.status(200).send()
      } else {
        res.status(404).send()
      }
    } catch (err) {
      const error = databaseErrorHandler(err)
      res.status(error.statusCode ? error.statusCode : 400).send(JsonSerializer.serializeError(error))
    }
  }
}

export { index, create, read, update, deletion }
