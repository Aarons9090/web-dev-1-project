const User = require('../models/user')
const Role = require('../models/role')
const { getRequestBody } = require('../utils/helpers')

class UserService {
  async getUsers(req, res) {
    try {
      const users = await User.find({})
      res.statusCode = 200
      res.end(JSON.stringify(users))
    } catch (error) {
      res.statusCode = 400
      res.body = { error: error.message }
      res.end()
    }
  }

  async createUser(req, res) {
    res.setHeader('Content-Type', 'application/json')
    try {
      const requestBody = await getRequestBody(req)
      const userData = JSON.parse(requestBody)

      const { username, password, roleName } = userData
      const userRole = await Role.findOne({ name: roleName })

      if (!userRole) {
        res.statusCode = 400
        res.body = { error: 'Role not found' }
        res.end()
        return
      }

      const newUser = new User({
        username: username,
        password: password,
        role: userRole.id,
      })

      const savedUser = await (await newUser.populate('role')).save()
      res.statusCode = 201
      res.end(JSON.stringify(savedUser))
    } catch (error) {
      res.statusCode = 400
      res.body = { error: error.message }
      res.end()
    }
  }
}

module.exports = UserService
