const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err)

    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong'
    }


    res.status(defaultError.statusCode).json({ message: defaultError.message })
}

module.exports = errorHandlerMiddleware