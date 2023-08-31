const { requestLogger } = require('./utils/middleware')
const jwt = require('jsonwebtoken')
const config = require('./utils/config')
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
const AuthService = require('./services/AuthService')

const userService = new UserService()
const productService = new ProductService()
const authService = new AuthService()

function handleRequest(req, res) {
  requestLogger(req, res, async () => {
    const { path } = url.parse(req.url, true)

    res.setHeader('Content-Type', 'application/json')

    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type,Accept,Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.214:8080')

    // check if user is logged in
    if (
      req.method !== 'OPTIONS' &&
      path !== '/api/login' &&
      path !== '/api/register'
    ) {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
        respondJson(res, 401, { error: 'Token missing or invalid' })
        return
      }
      const token = authHeader.substring(7)
      const decodedToken = jwt.verify(token, config.SECRET)
      if (!decodedToken.id) {
        respondJson(res, 401, { error: 'Token missing or invalid' })
        return
      }
    }

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
    }

    //Auth
    else if (req.method === 'POST' && path === '/api/login') {
      await authService.login(req, res)
    } else if (req.method === 'POST' && path === '/api/register') {
      await authService.register(req, res)
    } else {
      respondJson(res, 404, { error: 'Route not found' })
    }
  })
}

module.exports = handleRequest
