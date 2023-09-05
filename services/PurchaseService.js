const Product = require('../models/Product')
const Cart = require('../models/cart')
const Purchase = require('../models/purchase')
const config = require('../utils/config')
const { getRequestBodyJson, respondJson } = require('../utils/helpers')
const jwt = require('jsonwebtoken')

class PurchaseService {
  async getAllPurchases(req, res) {
    try {
      const purchases = await Purchase.find({})
      respondJson(res, 200, purchases)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }

  async getUserPurchases(req, res) {
    const authHeader = req.headers.authorization
    const token = authHeader.substring(7)
    try {
      const decodedToken = jwt.verify(token, config.SECRET)
      if (!decodedToken.id) {
        respondJson(res, 401, { error: 'Token missing or invalid' })
        return
      }

      const purchases = await Purchase.find({ user: decodedToken.id }).populate(
        'products.product'
      )

      if (!purchases) {
        respondJson(res, 404, { error: 'Purchase not found' })
        return
      }
      respondJson(res, 200, purchases)
    } catch (error) {
      respondJson(res, 401, { error: 'Token missing or invalid' })
      return
    }
  }

  async checkout(req, res) {
    const authHeader = req.headers.authorization
    const token = authHeader.substring(7)
    try {
      const decodedToken = jwt.verify(token, config.SECRET)
      if (!decodedToken.id) {
        respondJson(res, 401, { error: 'Token missing or invalid' })
        return
      }
      const cart = await Cart.findOne({ user: decodedToken.id })
      const purchase = new Purchase({
        products: cart.products,
        user: decodedToken.id,
      })
      await purchase.save()

      //empty cart
      await Cart.deleteOne({ user: decodedToken.id })
      respondJson(res, 201, purchase)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }
}

module.exports = PurchaseService
