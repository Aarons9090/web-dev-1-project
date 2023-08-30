const http = require('http')
const url = require('url')
const config = require('./utils/config')
const mongoose = require('mongoose')
const { requestLogger } = require('./utils/middleware')
const UserService = require('./services/user-service')
const { UserWithIdPath, UserPath } = require('./utils/constants')

const hostname = '127.0.0.1'
const port = config.PORT
const userService = new UserService()

mongoose
  .connect(config.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //TODO: logger middleware
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    //TODO: logger middleware
    // eslint-disable-next-line no-console
    console.error('Error connecting to MongoDB:', error.message)
  })

const server = http.createServer(async (req, res) => {
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
})

server.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${hostname}:${port}/`)
})
