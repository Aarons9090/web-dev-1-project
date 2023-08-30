const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
})

roleSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj.__v
    delete returnedObj._id
  },
})

const Role = mongoose.model('Role', roleSchema)

module.exports = Role
