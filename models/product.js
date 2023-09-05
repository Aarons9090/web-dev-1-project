const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  dateAdded: { type: Date, default: Date.now },
})

productSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    if (returnedObj._id) {
      returnedObj.id = returnedObj._id.toString()
    }

    delete returnedObj.__v
    delete returnedObj._id
  },
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
