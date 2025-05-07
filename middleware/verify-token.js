const { blacklistedTokens } = require('../controller/main')
const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(400).json({ message: 'Problem with authHeader' })
    }
    const token = authHeader.split(' ')[1]
    if (!token) { return res.status(400).json({ message: 'Token does not exist' }) }

    if (blacklistedTokens.has(token)) { return res.status(403).json({ message: 'Your token is blacklisted' }) }

    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, decoded) => {
        if (err) { return res.status(400).json({ message: 'Error verifying the token' }) }
        req.userId = decoded.id
        req.role = decoded.role
        req.user = decoded.username
        req.token = token
        next()
    })

}

module.exports = verifyToken