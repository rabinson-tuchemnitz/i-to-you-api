const { APP_NAME, APP_ENV, APP_PORT } = require('../config/app')
const { success } = require('consola')

/*
|--------------------------------------------------------------------------
| Create Express Application
|--------------------------------------------------------------------------
*/
const app = require('express')()

/*
|--------------------------------------------------------------------------
| Configure Database
|--------------------------------------------------------------------------
*/
require('./database.js')()

/*
|--------------------------------------------------------------------------
| Configure Passport
|--------------------------------------------------------------------------
*/
const passport = require('passport')
app.use(passport.initialize())
require('./passport')(passport)

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/
app.use(require('helmet')())

const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use(require('cors')())

/*
|--------------------------------------------------------------------------
| Routes Middlewares
|--------------------------------------------------------------------------
*/
app.use('/api/users', require('../routes/users'))
app.use('/api/files/', require('../routes/files'))

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
|
*/
app.listen(APP_PORT, () => {
  success({
    message: `${APP_NAME} ${APP_ENV} server started on PORT: ${APP_PORT}`,
    badge: true
  })
})
