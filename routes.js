const { requestLogger } = require('./utils/middleware')
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
const url = require('url')
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
    const { path } = url.parse(req.url, true)
    const { method } = req

    res.setHeader('Content-Type', 'application/json')

    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type,Accept,Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080')

    // Paths that don't require authentication
    if (method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
      return
    }

    if (method === 'POST' && path === LoginPath) {
      await authService.login(req, res)
      return
    } else if (method === 'POST' && path === RegisterPath) {
      await authService.register(req, res)
      return
    }

    // Paths that require authentication
    // verify user token
    if (!getVerifiedToken(req, res)) {
      return
    }

    // Users
    if (method === 'GET' && path === UserPath) {
      await userService.getUsers(req, res)
    } else if (method === 'GET' && path.match(UserWithIdPath)) {
      await userService.getUserById(req, res)
    } else if (method === 'PUT' && path.match(UserWithIdPath)) {
      await userService.updateUser(req, res)
    } else if (method === 'DELETE' && path.match(UserWithIdPath)) {
      await userService.deleteUser(req, res)
    }
    // Products
    else if (method === 'GET' && path === ProductPath) {
      await productService.getProducts(req, res)
    } else if (method === 'GET' && path.match(ProductWithIdPath)) {
      await productService.getProductById(req, res)
    } else if (method === 'POST' && path === ProductPath) {
      await productService.createProduct(req, res)
    } else if (method === 'PUT' && path.match(ProductWithIdPath)) {
      await productService.updateProduct(req, res)
    } else if (method === 'DELETE' && path.match(ProductWithIdPath)) {
      await productService.deleteProduct(req, res)
    }

    //Auth
    else if (method === 'GET' && path === RolePath) {
      await authService.getUserRole(req, res)
    }

    //Cart
    else if (method === 'GET' && path === CartPath) {
      await cartService.getCart(req, res)
    } else if (method === 'POST' && path === CartAddPath) {
      await cartService.addToCart(req, res)
    } else if (method === 'POST' && path === CartRemovePath) {
      await cartService.removeFromCart(req, res)
    } else if (method === 'POST' && path === CartDeletePath) {
      await cartService.deleteFromCart(req, res)
    } else if (method === 'POST' && path === CartEmptyPath) {
      await cartService.emptyCart(req, res)
    }
    // Purchases
    else if (method === 'POST' && path === CheckoutPath) {
      await purchaseService.checkout(req, res)
    } else if (method === 'GET' && path === PurchasesPath) {
      await purchaseService.getAllPurchases(req, res)
    } else if (method === 'GET' && path === PurchasesPathUser) {
      await purchaseService.getUserPurchases(req, res)
    } else {
      respondJson(res, 404, { error: 'Route not found' })
    }
  })
}

module.exports = handleRequest
