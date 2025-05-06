const jwt = require('jsonwebtoken')
const { BadRequest } = require('../errors')
const authorizationMiddleware = require('../middleware/auth')

const login = (req, res) => {
    const { username, password } = req.body
    if (!username || username.trim() === '' || !password || password.trim() === '') {
        throw new BadRequest('Please probide a username and a password')
    }
    const id = Math.floor(Math.random() * 100)
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.status(200).json({ msg: 'User Created', token: `${token}` })
}

const dashboard = (req, res) => {
    const secret = Math.floor(Math.random() * 100)
    res.status(200).json({ msg: `Hello ${req.user.username}`, secret: `Your secret number is ${secret}` })
}


module.exports = {
    login,
    dashboard
}