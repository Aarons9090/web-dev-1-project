const http = require('http')

const config = require('./utils/config')
const handleRequest = require('./routes')
const { loadDb } = require('./utils/helpers')

const hostname = '0.0.0.0'
const port = config.PORT

loadDb()

const server = http.createServer(handleRequest)

server.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${hostname}:${port}/`)
})
