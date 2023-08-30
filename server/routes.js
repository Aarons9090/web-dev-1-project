const { requestLogger } = require('./utils/middleware')
const UserService = require('./services/UserService')
const { UserWithIdPath, UserPath } = require('./utils/constants')
const url = require('url')

const userService = new UserService()

function handleRequest(req, res) {
  requestLogger(req, res, async () => {
    const { path } = url.parse(req.url, true)

    res.setHeader('Content-Type', 'application/json')

    if (req.method === 'POST' && path === UserPath) {
      await userService.createUser(req, res)
    } else if (req.method === 'GET' && path === UserPath) {
      await userService.getUsers(req, res)
    } else if (req.method === 'GET' && path.match(UserWithIdPath)) {
      await userService.getUserById(req, res)
    } else if (req.method === 'PUT' && path.match(UserWithIdPath)) {
      await userService.updateUser(req, res)
    } else if (req.method === 'DELETE' && path.match(UserWithIdPath)) {
      await userService.deleteUser(req, res)
    } else {
      res.statusCode = 404
      res.body = { error: 'Not found' }
      res.end()
    }
  })
}

module.exports = handleRequest
