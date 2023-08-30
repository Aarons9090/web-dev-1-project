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

module.exports = {
  getRequestBodyJson,
  getIdFromUrl,
}
