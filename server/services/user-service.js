const User = require('../models/user')
const Role = require('../models/role')

async function getUsers() {
  const users = await User.find({})
  return users
}

async function createUser(userData) {
  const { username, password, roleName } = userData

  const userRole = await Role.findOne({ name: roleName })

  const newUser = new User({
    username: username,
    password: password,
    role: userRole._id,
  })

  const savedUser = await (await newUser.populate('role')).save()

  //TODO: populate role?
  return savedUser
}

module.exports = {
  createUser,
  getUsers,
}
