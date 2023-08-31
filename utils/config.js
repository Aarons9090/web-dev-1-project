/* eslint-disable no-undef */
require('dotenv').config()

const MONGOURL = process.env.MONDODB_URI
const PORT = process.env.PORT
const SECRET = process.env.SECRET
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)

module.exports = {
  MONGOURL,
  PORT,
  SECRET,
  SALT_ROUNDS,
}
