/* eslint-disable no-console */
function requestLogger(req, res, next) {
  const { method, url } = req

  let requestBody = ''

  req.on('data', (chunk) => {
    requestBody += chunk
  })

  req.on('end', () => {
    logger(`[${new Date().toISOString()}] ${method} ${url}`)
    if (requestBody) {
      logger(`Request body: ${requestBody}`)
    }
  })
  next()
}

function logger(message) {
  // add production check when neccecary
  console.log(message)
}

module.exports = {
  requestLogger,
  logger,
}
