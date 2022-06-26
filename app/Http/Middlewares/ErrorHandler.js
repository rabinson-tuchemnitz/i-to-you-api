const {APP_ENV} = require('../../../config/app');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ?? 500;
    res.status(statusCode).json({
        message: APP_ENV == "productionn" ? null : err.message
    })
}

module.exports = {
    errorHandler
}