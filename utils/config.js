/* eslint-disable no-undef */
require('dotenv').config()

const MONGOURL = process.env.MONDODB_URI
const PORT = process.env.PORT
const SECRET = process.env.SECRET

module.exports = {
  MONGOURL,
  PORT,
  SECRET,
}
