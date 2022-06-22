require('dotenv').config()

module.exports = {
  APP_NAME: process.env.APP_NAME,
  APP_PORT: process.env.APP_PORT,
  APP_ENV: process.env.APP_ENV,
  DB_CONNECTION: process.env.DB_CONNECTION,
  SECRET: process.env.APP_SECRET
}
