const Cart = require('../models/cart')
const Purchase = require('../models/purchase')
const { respondJson, getVerifiedToken } = require('../utils/helpers')
const { PurchasesNotFound, PurchasesError } =
  require('../utils/constants').ErrorMessages

class PurchaseService {
  async getAllPurchases(req, res) {
    try {
      const purchases = await Purchase.find({})
        .populate('products.product')
        .populate('user', { username: 1 })
      respondJson(res, 200, purchases)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }

  async getUserPurchases(req, res) {
    try {
      const decodedToken = getVerifiedToken(req, res)

      const purchases = await Purchase.find({ user: decodedToken.id }).populate(
        'products.product'
      )

      if (!purchases) {
        respondJson(res, 404, { error: PurchasesNotFound })
        return
      }
      respondJson(res, 200, purchases)
    } catch (error) {
      respondJson(res, 401, { error: PurchasesError })
      return
    }
  }

  async checkout(req, res) {
    try {
      const decodedToken = getVerifiedToken(req, res)
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
