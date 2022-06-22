const cors = require('cors')
const bp = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const { success, error } = require('consola')
const { APP_NAME, APP_ENV, APP_PORT, DB_CONNECTION } = require('./config/app')

const app = express()

// Middlewares
app.use(cors())
app.use(bp.json())

// Router Middleware
app.use('/api/users', require('./routes/users'))

const bootstrapApp = async () => {
  try {
    await mongoose.connect(DB_CONNECTION)

    success({
      message: `Database connected successfully: \n ${DB_CONNECTION}`,
      badge: true
    })

    app.listen(APP_PORT, () => {
      success({
        message: `${APP_NAME} ${APP_ENV} server started on PORT: ${APP_PORT}`,
        badge: true
      })
    })
  } catch (err) {
    error({
      message: `Failed to connect database :\n${DB_CONNECTION} \n${err}`,
      badge: true
    })

    bootstrapApp()
  }
}

bootstrapApp()
