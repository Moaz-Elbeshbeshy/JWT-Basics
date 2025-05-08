const blacklistedTokenMap = require('../models/blacklistedToken')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('../errors/custome-error')

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        throw new CustomAPIError('Authorization header is missing', StatusCodes.BAD_REQUEST)
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
        throw new CustomAPIError('Token is missing from header', StatusCodes.BAD_REQUEST)
    }

    const blacklisted = await blacklistedTokenMap.findOne({ token })
    if (blacklisted) {
        throw new CustomAPIError('This token has been blacklisted', StatusCodes.FORBIDDEN)
    }

    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, decoded) => {
        if (err) {
            throw new CustomAPIError('Invalid or expired token', StatusCodes.UNAUTHORIZED)
        }

        req.userId = decoded.id
        req.role = decoded.role
        req.user = decoded.username
        req.token = token
        next()
    })
}

module.exports = verifyToken
