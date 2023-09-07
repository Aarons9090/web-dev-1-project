const { requestLogger } = require('./utils/middleware')
const path = require('path')
const fs = require('fs')
const {
  UserWithIdPath,
  UserPath,
  ProductPath,
  ProductWithIdPath,
  LoginPath,
  RegisterPath,
  RolePath,
  CartPath,
  PurchasesPath,
  PurchasesPathUser,
  CheckoutPath,
  CartAddPath,
  CartRemovePath,
  CartDeletePath,
  CartEmptyPath,
} = require('./utils/constants').Paths
const { NotFound, InvalidToken } = require('./utils/constants').ErrorMessages
const { respondJson, getVerifiedToken } = require('./utils/helpers')
const UserService = require('./services/UserService')
const ProductService = require('./services/ProductService')
const AuthService = require('./services/AuthService')
const CartService = require('./services/CartService')
const PurchaseService = require('./services/PurchaseService')

const userService = new UserService()
const productService = new ProductService()
const authService = new AuthService()
const cartService = new CartService()
const purchaseService = new PurchaseService()

function handleRequest(req, res) {
  requestLogger(req, res, async () => {
    const { method } = req

    const requestedUrl = req.url === '/' ? '/index.html' : req.url

    // Route api calls
    if (requestedUrl.startsWith('/api')) {
      res.setHeader('Content-Type', 'application/json')

      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type,Accept,Authorization'
      )
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
      //TODO: cors?

      // Paths that don't require authentication
      if (method === 'OPTIONS') {
        res.writeHead(200)
        res.end()
        return
      }

      if (method === 'POST' && requestedUrl === LoginPath) {
        await authService.login(req, res)
        return
      } else if (method === 'POST' && requestedUrl === RegisterPath) {
        await authService.register(req, res)
        return
      }

      // Paths that require authentication
      // verify user token
      if (!getVerifiedToken(req, res)) {
        respondJson(res, 401, { error: InvalidToken })
        return
      }

      // Users
      if (method === 'GET' && requestedUrl === UserPath) {
        await userService.getUsers(req, res)
      } else if (method === 'GET' && requestedUrl.match(UserWithIdPath)) {
        await userService.getUserById(req, res)
      } else if (method === 'PUT' && requestedUrl.match(UserWithIdPath)) {
        await userService.updateUser(req, res)
      } else if (method === 'DELETE' && requestedUrl.match(UserWithIdPath)) {
        await userService.deleteUser(req, res)
      }
      // Products
      else if (method === 'GET' && requestedUrl === ProductPath) {
        await productService.getProducts(req, res)
      } else if (method === 'GET' && requestedUrl.match(ProductWithIdPath)) {
        await productService.getProductById(req, res)
      } else if (method === 'POST' && requestedUrl === ProductPath) {
        await productService.createProduct(req, res)
      } else if (method === 'PUT' && requestedUrl.match(ProductWithIdPath)) {
        await productService.updateProduct(req, res)
      } else if (method === 'DELETE' && requestedUrl.match(ProductWithIdPath)) {
        await productService.deleteProduct(req, res)
      }

      //Auth
      else if (method === 'GET' && requestedUrl === RolePath) {
        await authService.getUserRole(req, res)
      }

      //Cart
      else if (method === 'GET' && requestedUrl === CartPath) {
        await cartService.getCart(req, res)
      } else if (method === 'POST' && requestedUrl === CartAddPath) {
        await cartService.addToCart(req, res)
      } else if (method === 'POST' && requestedUrl === CartRemovePath) {
        await cartService.removeFromCart(req, res)
      } else if (method === 'POST' && requestedUrl === CartDeletePath) {
        await cartService.deleteFromCart(req, res)
      } else if (method === 'POST' && requestedUrl === CartEmptyPath) {
        await cartService.emptyCart(req, res)
      }
      // Purchases
      else if (method === 'POST' && requestedUrl === CheckoutPath) {
        await purchaseService.checkout(req, res)
      } else if (method === 'GET' && requestedUrl === PurchasesPath) {
        await purchaseService.getAllPurchases(req, res)
      } else if (method === 'GET' && requestedUrl === PurchasesPathUser) {
        await purchaseService.getUserPurchases(req, res)
      } else {
        respondJson(res, 404, { error: NotFound })
      }
    } else {
      // Route static files
      const staticDir = path.join(__dirname, 'public')
      const filePath = path.join(staticDir, requestedUrl)

      if (fs.existsSync(filePath)) {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(500)
            res.end('Internal Server Error')
          } else {
            res.writeHead(200, { 'Content-Type': getContentType(filePath) })
            res.end(data)
          }
        })
      } else {
        res.writeHead(404)
        res.end('Not Found')
      }
    }
  })
}

function getContentType(filePath) {
  const extname = path.extname(filePath)
  switch (extname) {
    case '.html':
      return 'text/html'
    case '.css':
      return 'text/css'
    case '.js':
      return 'text/javascript'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    default:
      return 'application/octet-stream'
  }
}

module.exports = handleRequest
