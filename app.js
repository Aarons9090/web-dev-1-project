const http = require('http')

const config = require('./utils/config')
const handleRequest = require('./routes')
const { loadDb } = require('./utils/helpers')

const port = config.PORT

loadDb()

const server = http.createServer(handleRequest)

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`)
})
