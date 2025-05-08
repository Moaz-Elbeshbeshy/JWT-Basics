const { blacklistedTokens, refreshTokens } = require('../controller/main')
const jwt = require('jsonwebtoken')
const refreshTokenModel = require('../models/refreshToken')
const blacklistedTokenModel = require('../models/blacklistedToken')
const CustomAPIError = require('../errors/custome-error')
const { StatusCodes } = require('http-status-codes')



const verifyRefresh = async (req, res, next) => {
    const { refreshToken } = req.body

    if (!refreshToken) { throw new CustomAPIError('Refresh token not provided', StatusCodes.BAD_REQUEST) }

    const blacklisted = await blacklistedTokenModel.findOne({ token: refreshToken })
    if (blacklisted) { throw new CustomAPIError('This token is blacklisted', StatusCodes.BAD_REQUEST) }

    const storedToken = await refreshTokenModel.findOne({ token: refreshToken })
    if (!storedToken) { throw new CustomAPIError('No Token found', StatusCodes.NOT_FOUND) }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY)

        if (decoded.username !== storedToken.username) {
            throw new CustomAPIError('User from token does not match user from refreshToken', StatusCodes.BAD_REQUEST)
        }

        req.userId = decoded.id
        req.role = decoded.role
        req.user = decoded.username
        req.token = refreshToken

        next()
    } catch (err) {
        console.error(err)
        throw new CustomAPIError('Error verifying refresh token', StatusCodes.BAD_REQUEST)
    }
}

module.exports = verifyRefresh