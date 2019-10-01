import PasetoAuth from '../helpers/paseto-auth'

export default (roleGuard: string[]): Function => {
  return async (req, res, next): Promise<void> => {
    // if (process.env.TEST_IS_ADMIN && process.env.NODE_ENV === 'test') {
    //   next()
    //   return
    // }
    req.roles = []
    const user = req.user
    for (let i = 0; i < roleGuard.length; i++) {
      if (await PasetoAuth.checkUserRole(user, roleGuard[i])) {
        req.roles.push(roleGuard[i])
      } else {
        res.status(403).json({errors: {title: 'Forbidden'}})
        return
      }
    }
    if (req.roles.length) {
      next()
      return
    }
  }
}
