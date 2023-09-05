const bcrypt = require('bcrypt')
const User = require('../models/user')
const Role = require('../models/role')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const {
  getRequestBodyJson,
  respondJson,
  getVerifiedToken,
} = require('../utils/helpers')
const { WebTokenExpirationSeconds } = require('../utils/constants')

class AuthService {
  async login(req, res) {
    try {
      const userData = await getRequestBodyJson(req)

      const { username, password } = userData

      const user = await User.findOne({
        username,
      })

      if (!user) {
        respondJson(res, 400, {
          error: 'User not found',
        })
        return
      }

      const passwordCorrect = await bcrypt.compare(password, user.password)

      if (!passwordCorrect) {
        respondJson(res, 401, {
          error: 'Invalid password',
        })
        return
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      const token = jwt.sign(userForToken, config.SECRET, {
        expiresIn: WebTokenExpirationSeconds,
      })

      respondJson(res, 200, {
        token,
        username: user.username,
        role: user.role.name,
      })
    } catch (error) {
      respondJson(res, 400, {
        error: error.message,
      })
    }
  }

  async register(req, res) {
    try {
      const userData = await getRequestBodyJson(req)

      const { username, password } = userData

      if (!username || !password) {
        respondJson(res, 400, {
          error: 'Username and password are required',
        })
        return
      }

      const existingUser = await User.findOne({
        username,
      })

      if (existingUser) {
        respondJson(res, 400, {
          error: 'Username already exists',
        })
        return
      }

      const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS)

      const userRole = await Role.findOne({ name: 'Customer' })

      if (!userRole) {
        respondJson(res, 503, {
          error: 'Error creating user',
        })
        return
      }

      const user = new User({
        username: username,
        password: passwordHash,
        role: userRole.id,
      })

      const savedUser = await user.save()

      respondJson(res, 201, savedUser)
    } catch (error) {
      respondJson(res, 400, {
        error: error.message,
      })
    }
  }

  //TODO: yhteiset errorit
  async getUserRole(req, res) {
    try {
      const decodedToken = getVerifiedToken(req, res)

      const user = await User.findById(decodedToken.id).populate('role')
      if (!user) {
        respondJson(res, 401, { error: 'Token missing or invalid' })
        return
      }
      respondJson(res, 200, { role: user.role.name })
    } catch (error) {
      respondJson(res, 401, { error: 'Token missing or invalid' })
      return
    }
  }
}

module.exports = AuthService
