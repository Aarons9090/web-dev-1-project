/* eslint-disable no-console */
function requestLogger(req, res, next) {
  const { method, url } = req

  let requestBody = ''

  req.on('data', (chunk) => {
    requestBody += chunk
  })

  req.on('end', () => {
    console.log(`[${new Date().toISOString()}] ${method} ${url}`)
    console.log('Request Body:', requestBody)
  })
  next()
}

module.exports = {
  requestLogger,
}
