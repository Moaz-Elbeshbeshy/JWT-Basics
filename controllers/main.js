// check username, password in post(login) request
// if exist create new JWT
// send back to front-end

// setup authentication so only the request with JWT can access the dashboard
const { BadRequest } = require('../errors')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth')

const login = (req, res) => {
    const { username, password } = req.body
    if (!username || username.trim() === '' || !password || password.trim() === '') {
        throw new BadRequest('Please provide username and password')
    }

    const id = Math.floor(Math.random() * 100)
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' })

    res.status(200).json({ msg: 'user created', token })
}

const dashboard = (req, res) => {
    const luckyNumber = Math.floor(Math.random() * 100)
    res.status(200).json({ msg: `Hi ${req.user.username}`, secret: `The top secret number is: ${luckyNumber}` })
}

module.exports = {
    login,
    dashboard,
}