const { requestLogger } = require('./utils/middleware')
const UserService = require('./services/UserService')
const ProductService = require('./services/ProductService')
const {
  UserWithIdPath,
  UserPath,
  ProductPath,
  ProductWithIdPath,
} = require('./utils/constants')
const url = require('url')
const { respondJson } = require('./utils/helpers')

const userService = new UserService()
const productService = new ProductService()

function handleRequest(req, res) {
  requestLogger(req, res, async () => {
    const { path } = url.parse(req.url, true)

    res.setHeader('Content-Type', 'application/json')

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.214:8080')

    if (req.method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
      return
    }
    // Users
    else if (req.method === 'POST' && path === UserPath) {
      await userService.createUser(req, res)
    } else if (req.method === 'GET' && path === UserPath) {
      await userService.getUsers(req, res)
    } else if (req.method === 'GET' && path.match(UserWithIdPath)) {
      await userService.getUserById(req, res)
    } else if (req.method === 'PUT' && path.match(UserWithIdPath)) {
      await userService.updateUser(req, res)
    } else if (req.method === 'DELETE' && path.match(UserWithIdPath)) {
      await userService.deleteUser(req, res)
    }
    // Products
    else if (req.method === 'GET' && path === ProductPath) {
      await productService.getProducts(req, res)
    } else if (req.method === 'GET' && path.match(ProductWithIdPath)) {
      await productService.getProductById(req, res)
    } else if (req.method === 'POST' && path === ProductPath) {
      await productService.createProduct(req, res)
    } else if (req.method === 'PUT' && path.match(ProductWithIdPath)) {
      await productService.updateProduct(req, res)
    } else if (req.method === 'DELETE' && path.match(ProductWithIdPath)) {
      await productService.deleteProduct(req, res)
    } else {
      respondJson(res, 404, { error: 'Route not found' })
    }
  })
}

module.exports = handleRequest
