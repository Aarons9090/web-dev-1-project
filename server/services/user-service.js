const User = require('../models/user')
const Role = require('../models/role')
const { getRequestBodyJson, getIdFromUrl } = require('../utils/helpers')

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

  async getUserById(req, res) {
    const id = getIdFromUrl(req.url)
    try {
      const user = await User.findById(id).populate('role')

      if (!user) {
        res.statusCode = 404
        res.body = { error: 'User not found' }
        res.end()
        return
      }
      res.statusCode = 200
      res.end(JSON.stringify(user))
    } catch (error) {
      res.statusCode = 400
      res.body = { error: error.message }
      res.end()
    }
  }

  async createUser(req, res) {
    res.setHeader('Content-Type', 'application/json')
    try {
      const userData = await getRequestBodyJson(req)

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

  async updateUser(req, res) {
    const id = getIdFromUrl(req.url)

    const userData = await getRequestBodyJson(req)
    try {
      const user = await User.findByIdAndUpdate(id, userData, {
        new: true,
      }).populate('role')

      if (!user) {
        res.statusCode = 404
        res.body = { error: 'User not found' }
        res.end()
        return
      }
      res.statusCode = 200
      res.end(JSON.stringify(user))
    } catch (error) {
      res.statusCode = 400
      res.body = { error: error.message }
      res.end()
    }
  }

  async deleteUser(req, res) {
    const id = getIdFromUrl(req.url)
    try {
      await User.findByIdAndDelete(id)
      res.statusCode = 204
      res.end()
    } catch (error) {
      res.statusCode = 400
      res.body = { error: error.message }
      res.end()
    }
  }
}

module.exports = UserService
