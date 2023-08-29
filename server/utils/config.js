require('dotenv').config()

const MONGOURL = process.env.MONDODB_URI
const PORT = process.env.PORT

module.exports = {
  MONGOURL,
  PORT,
}
