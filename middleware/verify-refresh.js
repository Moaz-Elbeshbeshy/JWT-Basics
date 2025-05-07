const { blacklistedTokens, refreshTokens } = require('../controller/main')
const jwt = require('jsonwebtoken')


const verifyRefresh = (req, res, next) => {

    const { refreshToken } = req.body
    if (!refreshToken) { return res.status(400).json({ message: 'refresh token not provided' }) }
    if (blacklistedTokens.has(refreshToken)) { return res.status(400).json({ message: 'This token is blacklisted' }) }
    const username = Array.from(refreshTokens.entries()).find(([, token]) => token === refreshToken)?.[0]
    if (!username) { return res.status(400).json({ message: 'Invalid refresh token' }) }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, decoded) => {
        if (err) { return res.status(400).json({ message: 'Error verifying refresh token' }) }
        if (decoded.username !== username) { return res.status(400).json({ message: 'user from token does not match user from refreshTokens map' }) }
        req.userId = decoded.id
        req.role = decoded.role
        req.user = decoded.username
        req.token = refreshToken
    })

    next()
}

module.exports = verifyRefresh