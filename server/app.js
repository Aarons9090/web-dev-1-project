const http = require('http')
const url = require('url')
const config = require('./utils/config')
const mongoose = require('mongoose')
const userService = require('./services/user-service')

const hostname = '127.0.0.1'
const port = config.PORT

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
  const parsedUrl = url.parse(req.url, true)
  const path = parsedUrl.pathname

  let requestBody = ''

  req.on('data', (chunk) => {
    requestBody += chunk.toString()
  })

  res.setHeader('Content-Type', 'application/json')
  if (req.method === 'POST' && path === '/api/users') {
    req.on('end', async () => {
      try {
        const userData = JSON.parse(requestBody)
        const user = await userService.createUser(userData)
        res.statusCode = 201
        res.end(JSON.stringify(user))
      } catch (error) {
        res.statusCode = 400
        res.body = { error: error.message }
        res.end()
      }
    })
  } else if (req.method === 'GET' && path === '/api/users') {
    try {
      const users = await userService.getUsers()
      res.statusCode = 200
      res.end(JSON.stringify(users))
    } catch (error) {
      res.statusCode = 400
      res.body = { error: error.message }
      res.end()
    }
  } else {
    res.statusCode = 404
    res.body = { error: 'Not found' }
    res.end()
  }
})

server.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${hostname}:${port}/`)
})
