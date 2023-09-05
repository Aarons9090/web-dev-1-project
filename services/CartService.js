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

      let cart = await Cart.findOne({ user: decodedToken.id }).populate(
        'products.product'
      )

      //if no cart, create cart
      if (!cart) {
        cart = new Cart({
          products: [],
          user: decodedToken.id,
        })
        await cart.save()
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
      //if product already in cart, increase quantity
      const productInCart = cart.products.find((productInCart) =>
        productInCart.product._id.equals(productData.productId)
      )
      if (productInCart) {
        productInCart.quantity += 1
        await cart.save()
        respondJson(res, 200, cart)
        return
      }
      //else add product to cart
      cart.products = cart.products.concat({
        product: product._id,
        quantity: 1,
      })

      await cart.save()
      respondJson(res, 200, cart)
    } catch (error) {
      respondJson(res, 401, { error: 'Token missing or invalid' })
      return
    }
  }

  /**
   * Used to decrease quantity of product in cart or remove product from cart if quantity = 1
   */
  async removeFromCart(req, res) {
    const authHeader = req.headers.authorization
    const token = authHeader.substring(7)
    const productData = await getRequestBodyJson(req)
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
      const product = await Product.findById(productData.productId)

      if (!product) {
        respondJson(res, 404, { error: 'Product not found' })
        return
      }
      //if product already in cart, decrease quantity
      const productInCart = cart.products.find((productInCart) =>
        productInCart.product._id.equals(productData.productId)
      )

      if (productInCart) {
        if (productInCart.quantity > 1) {
          productInCart.quantity -= 1
          await cart.save()
          respondJson(res, 200, cart)
          return
        }
      }
      //else remove product from cart
      cart.products = cart.products.filter(
        (product) => !product.product._id.equals(productData.productId)
      )

      await cart.save()
      respondJson(res, 200, cart)
    } catch (error) {
      respondJson(res, 401, { error: 'Token missing or invalid' })
      return
    }
  }

  async deleteFromCart(req, res) {
    const authHeader = req.headers.authorization
    const token = authHeader.substring(7)
    const productData = await getRequestBodyJson(req)
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

      cart.products = cart.products.filter(
        (product) => !product.product._id.equals(productData.productId)
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
