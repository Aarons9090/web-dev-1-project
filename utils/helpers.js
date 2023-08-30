const mongoose = require('mongoose')
const config = require('./config')
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
}
