const mongoose = require('mongoose')
const config = require('./config')
const jwt = require('jsonwebtoken')

async function getRequestBodyJson(req) {
  return new Promise((resolve, reject) => {
    let requestBody = ''

    req.on('data', (chunk) => {
      requestBody += chunk
    })

    req.on('end', () => {
      try {
        const jsonData = JSON.parse(requestBody)
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', (err) => {
      reject(err)
    })
  })
}

function getIdFromUrl(url) {
  const urlParts = url.split('/')
  return urlParts[urlParts.length - 1]
}

function respondJson(res, statusCode, data) {
  res.statusCode = statusCode
  res.end(JSON.stringify(data))
}

function getVerifiedToken(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    respondJson(res, 401, { error: 'Token missing or invalid' })
    return false
  }
  const token = authHeader.substring(7)
  try {
    const decodedToken = jwt.verify(token, config.SECRET)
    if (!decodedToken.id) {
      respondJson(res, 401, { error: 'Token missing or invalid' })
      return false
    }
    return decodedToken
  } catch (error) {
    respondJson(res, 401, { error: 'Token missing or invalid' })
    return false
  }
}

function loadDb() {
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
}

module.exports = {
  getRequestBodyJson,
  getIdFromUrl,
  respondJson,
  loadDb,
  getVerifiedToken,
}
