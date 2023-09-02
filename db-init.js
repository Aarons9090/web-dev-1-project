const { loadDb, disconnectDb } = require('./utils/helpers')
const Product = require('./models/Product')
const Role = require('./models/role')
const User = require('./models/user')
const { default: mongoose } = require('mongoose')

const mockProducts = [
  {
    name: 'Bycicle',
    price: 100,
    description: 'A bycicle to ride around the city',
  },
  {
    name: 'Car',
    price: 10000,
    description: 'The best car in the world',
  },
  {
    name: 'Guitar',
    price: 500,
    description: 'A nice guitar',
  },
  {
    name: 'Piano',
    price: 1000,
    description: 'Piano for beginners',
  },
]

const mockUsers = [
  {
    username: 'admin',
    password: 'admin',
  },
  {
    username: 'user',
    password: 'user',
  },
]

async function loadData() {
  try {
    loadDb()

    // Delete all products and users
    await Product.deleteMany({})
    await User.deleteMany({})

    // Create new data
    const productPromises = mockProducts.map(async (product) => {
      const newProduct = new Product({
        name: product.name,
        price: product.price,
        description: product.description,
      })
      await newProduct.save()
    })

    const userPromises = mockUsers.map(async (user) => {
      const role = await Role.findOne({
        name: user.username === 'admin' ? 'Admin' : 'Customer',
      })
      const newUser = new User({
        username: user.username,
        password: user.password,
        role: role.id,
      })
      await newUser.save()
    })

    // Wait for all product and user creation promises to resolve
    await Promise.all([...productPromises, ...userPromises])

    // Disconnect from the database
    await mongoose.disconnect()
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

loadData()
