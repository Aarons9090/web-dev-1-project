const Product = require('../models/product')

const {
  getRequestBodyJson,
  getIdFromUrl,
  respondJson,
} = require('../utils/helpers')

const { ProductNotFound } = require('../utils/constants').ErrorMessages

class ProductService {
  async getProducts(req, res) {
    try {
      const products = await Product.find({})
      respondJson(res, 200, products)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }

  async getProductById(req, res) {
    const id = getIdFromUrl(req.url)
    try {
      const product = await Product.findById(id)

      if (!product) {
        respondJson(res, 404, { error: ProductNotFound })
        return
      }
      respondJson(res, 200, product)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }

  async createProduct(req, res) {
    try {
      const productData = await getRequestBodyJson(req)

      const { name, description, price } = productData

      const newProduct = new Product({
        name: name,
        description: description,
        price: price,
      })
      const savedProduct = await newProduct.save()

      respondJson(res, 201, savedProduct)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }

  async updateProduct(req, res) {
    const id = getIdFromUrl(req.url)

    const productData = await getRequestBodyJson(req)
    try {
      const product = await Product.findByIdAndUpdate(id, productData, {
        new: true,
      })

      if (!product) {
        respondJson(res, 404, { error: ProductNotFound })
        return
      }
      respondJson(res, 200, product)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }

  async deleteProduct(req, res) {
    const id = getIdFromUrl(req.url)
    try {
      const product = await Product.findByIdAndDelete(id)

      if (!product) {
        respondJson(res, 404, { error: ProductNotFound })
        return
      }
      respondJson(res, 200, null)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }
}

module.exports = ProductService
