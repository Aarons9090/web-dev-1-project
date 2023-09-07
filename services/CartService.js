const Cart = require('../models/cart')
const Product = require('../models/product')
const {
  getRequestBodyJson,
  respondJson,
  getVerifiedToken,
} = require('../utils/helpers')

const {
  InvalidToken,
  ProductNotFound,
  CartAddError,
  CartDeleteError,
  CartNotFoundError,
} = require('../utils/constants').ErrorMessages

class CartService {
  async getCart(req, res) {
    try {
      const decodedToken = getVerifiedToken(req, res)

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
      respondJson(res, 401, { error: InvalidToken })
      return
    }
  }

  async addToCart(req, res) {
    const productData = await getRequestBodyJson(req)
    try {
      const decodedToken = getVerifiedToken(req, res)

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
        respondJson(res, 404, { error: ProductNotFound })
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
      respondJson(res, 401, { error: CartAddError })
      return
    }
  }

  /**
   * Used to decrease quantity of product in cart or remove product from cart if quantity = 1
   */
  async removeFromCart(req, res) {
    const productData = await getRequestBodyJson(req)
    try {
      const decodedToken = getVerifiedToken(req, res)

      const cart = await Cart.findOne({ user: decodedToken.id })

      if (!cart) {
        respondJson(res, 404, { error: CartDeleteError })
        return
      }
      const product = await Product.findById(productData.productId)

      if (!product) {
        respondJson(res, 404, { error: CartDeleteError })
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
      respondJson(res, 401, { error: CartDeleteError })
      return
    }
  }

  async deleteFromCart(req, res) {
    const productData = await getRequestBodyJson(req)
    try {
      const decodedToken = getVerifiedToken(req, res)

      const cart = await Cart.findOne({ user: decodedToken.id })

      if (!cart) {
        respondJson(res, 404, { error: CartNotFoundError })
        return
      }

      cart.products = cart.products.filter(
        (product) => !product.product._id.equals(productData.productId)
      )

      await cart.save()
      respondJson(res, 200, cart)
    } catch (error) {
      respondJson(res, 401, { error: CartDeleteError })
      return
    }
  }

  async emptyCart(req, res) {
    try {
      const decodedToken = getVerifiedToken(req, res)
      const cart = await Cart.findOne({ user: decodedToken.id })
      if (!cart) {
        respondJson(res, 404, { error: CartNotFoundError })
        return
      }
      cart.products = []
      await cart.save()
      respondJson(res, 200, cart)
    } catch (error) {
      respondJson(res, 401, { error: CartDeleteError })
      return
    }
  }
}

module.exports = CartService
