async function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let requestBody = ''

    req.on('data', (chunk) => {
      requestBody += chunk
    })

    req.on('end', () => {
      resolve(requestBody)
    })

    req.on('error', (err) => {
      reject(err)
    })
  })
}

module.exports = {
  getRequestBody,
}
