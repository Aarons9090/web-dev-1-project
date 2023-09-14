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
const { InvalidCredentials, UserExists, UserCreationError, InvalidToken } =
  require('../utils/constants').ErrorMessages

class AuthService {
  async login(req, res) {
    try {
      const userData = await getRequestBodyJson(req)

      const { username, password } = userData

      const user = await User.findOne({
        username,
      }).populate('role')

      if (!user) {
        respondJson(res, 400, {
          error: InvalidCredentials,
        })
        return
      }

      const passwordCorrect = await bcrypt.compare(password, user.password)

      if (!passwordCorrect) {
        respondJson(res, 401, {
          error: InvalidCredentials,
        })
        return
      }

      const userForToken = {
        username: user.username,
        id: user._id,
        roleName: user.role.name,
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
          error: InvalidCredentials,
        })
        return
      }

      const existingUser = await User.findOne({
        username,
      })

      if (existingUser) {
        respondJson(res, 400, {
          error: UserExists,
        })
        return
      }

      const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS)

      const userRole = await Role.findOne({ name: 'Customer' })

      if (!userRole) {
        respondJson(res, 503, {
          error: UserCreationError,
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

  async getUserRole(req, res) {
    try {
      const decodedToken = getVerifiedToken(req, res)

      const user = await User.findById(decodedToken.id).populate('role')
      if (!user) {
        respondJson(res, 401, { error: InvalidToken })
        return
      }
      respondJson(res, 200, { role: user.role.name })
    } catch (error) {
      respondJson(res, 401, { error: InvalidToken })
      return
    }
  }
}

module.exports = AuthService
