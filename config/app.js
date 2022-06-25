require('dotenv').config()

module.exports = {
  APP_NAME: process.env.APP_NAME,
  APP_PORT: process.env.APP_PORT,
  APP_ENV: process.env.APP_ENV,
  DB_CONNECTION: process.env.DB_CONNECTION,
  APP_SECRET: process.env.APP_SECRET,

  MAX_FILE_SIZE: 1024,
  MAX_FILE_UPLOAD: 5
}
