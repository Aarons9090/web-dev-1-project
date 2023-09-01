const User = require('../models/user')
const Role = require('../models/role')
const {
  getRequestBodyJson,
  getIdFromUrl,
  respondJson,
} = require('../utils/helpers')

class UserService {
  async getUsers(req, res) {
    try {
      const users = await User.find({})
      const usersWithRole = await Promise.all(
        users.map(async (user) => {
          const userWithRole = await user.populate('role')
          return userWithRole
        })
      )
      respondJson(res, 200, usersWithRole)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }

  async getUserById(req, res) {
    const id = getIdFromUrl(req.url)
    try {
      const user = await User.findById(id).populate('role')

      if (!user) {
        respondJson(res, 404, { error: 'User not found' })
        return
      }
      respondJson(res, 200, user)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }

  async createUser(req, res) {
    res.setHeader('Content-Type', 'application/json')
    try {
      const userData = await getRequestBodyJson(req)

      const { username, password, roleName } = userData
      const userRole = await Role.findOne({ name: roleName })

      if (!userRole) {
        respondJson(res, 400, { error: 'Role not found' })
        return
      }

      const newUser = new User({
        username: username,
        password: password,
        role: userRole.id,
      })

      const savedUser = await (await newUser.populate('role')).save()
      respondJson(res, 201, savedUser)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }

  async updateUser(req, res) {
    const id = getIdFromUrl(req.url)

    const userData = await getRequestBodyJson(req)
    try {
      const role = await Role.findOne({ name: userData.role })

      if (!role) {
        respondJson(res, 400, { error: 'Role not found' })
        return
      }
      const user = await User.findByIdAndUpdate(
        id,
        { ...userData, role: role._id },
        {
          new: true,
        }
      ).populate('role')

      if (!user) {
        respondJson(res, 404, { error: 'User not found' })
        return
      }
      respondJson(res, 200, user)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }

  async deleteUser(req, res) {
    const id = getIdFromUrl(req.url)
    try {
      await User.findByIdAndDelete(id)
      respondJson(res, 200, null)
    } catch (error) {
      respondJson(res, 400, { error: error.message })
    }
  }
}

module.exports = UserService
