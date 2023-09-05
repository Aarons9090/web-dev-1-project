const Cart = require('../models/cart')
const Product = require('../models/Product')
const config = require('../utils/config')
const { getRequestBodyJson, respondJson } = require('../utils/helpers')
const jwt = require('jsonwebtoken')

class CartService {
  async getCart(req, res) {
    const authHeader = req.headers.authorization
    const token = authHeader.substring(7)
    try {
      const decodedToken = jwt.verify(token, config.SECRET)
      if (!decodedToken.id) {
        respondJson(res, 401, { error: 'Token missing or invalid' })
        return
      }

      const cart = await Cart.findOne({ user: decodedToken.id }).populate(
        'products'
      )
      if (!cart) {
        respondJson(res, 404, { error: 'Cart not found' })
        return
      }
      respondJson(res, 200, cart)
    } catch (error) {
      respondJson(res, 401, { error: 'Token missing or invalid' })
      return
    }
  }

  async addToCart(req, res) {
    const authHeader = req.headers.authorization
    const token = authHeader.substring(7)
    const productData = await getRequestBodyJson(req)
    try {
      const decodedToken = jwt.verify(token, config.SECRET)
      if (!decodedToken.id) {
        respondJson(res, 401, { error: 'Token missing or invalid' })
        return
      }
      let cart = await Cart.findOne({ user: decodedToken.id })

      //if no cart, create cart
      if (!cart) {
        cart = new Cart({
          products: [],
          user: decodedToken.id,
        })
        await cart.save()
      }

      const product = await Product.findById(productData.productId)
      if (!product) {
        respondJson(res, 404, { error: 'Product not found' })
        return
      }
      cart.products = cart.products.concat(product)

      await cart.save()
      respondJson(res, 200, cart)
    } catch (error) {
      respondJson(res, 401, { error: 'Token missing or invalid' })
      return
    }
  }

  async removeFromCart(req, res) {
    const authHeader = req.headers.authorization
    const token = authHeader.substring(7)
    try {
      const decodedToken = jwt.verify(token, config.SECRET)
      if (!decodedToken.id) {
        respondJson(res, 401, { error: 'Token missing or invalid' })
        return
      }
      const cart = await Cart.findOne({ user: decodedToken.id })
      if (!cart) {
        respondJson(res, 404, { error: 'Cart not found' })
        return
      }
      const product = await Product.findById(req.body.productId)
      if (!product) {
        respondJson(res, 404, { error: 'Product not found' })
        return
      }
      cart.products = cart.products.filter(
        (product) => product.id !== req.body.productId
      )
      await cart.save()
      respondJson(res, 200, cart)
    } catch (error) {
      respondJson(res, 401, { error: 'Token missing or invalid' })
      return
    }
  }

  async emptyCart(req, res) {
    const authHeader = req.headers.authorization
    const token = authHeader.substring(7)
    try {
      const decodedToken = jwt.verify(token, config.SECRET)
      if (!decodedToken.id) {
        respondJson(res, 401, { error: 'Token missing or invalid' })
        return
      }
      const cart = await Cart.findOne({ user: decodedToken.id })
      if (!cart) {
        respondJson(res, 404, { error: 'Cart not found' })
        return
      }
      cart.products = []
      await cart.save()
      respondJson(res, 200, cart)
    } catch (error) {
      respondJson(res, 401, { error: 'Token missing or invalid' })
      return
    }
  }
}

module.exports = CartService
