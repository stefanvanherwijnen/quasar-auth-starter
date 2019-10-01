import PasetoAuth from '../helpers/paseto-auth'

export default async function(req, res, next): Promise<void> {
  // if (process.env.TEST_IS_ADMIN && process.env.NODE_ENV === 'test') {
  //   next()
  //   return
  // }
  if (req.header('Authorization') !== undefined) {
    const authorized = await PasetoAuth.check(req)
    if (authorized) {
      next()
      return
    }
  }
  res.status(401).json({errors: {title: 'Unauthorized'}})
}
