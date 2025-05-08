const jwt = require('jsonwebtoken')
const User = require('../models/users')
const refreshTokenMap = require('../models/refreshToken')
const blacklistedTokenMap = require('../models/blacklistedToken')
const CustomAPIError = require('../errors/custome-error')
const { StatusCodes } = require('http-status-codes')


const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || username.trim() === '' || !password || password.trim() === '') {
        throw new CustomAPIError('Please provide a username and password', StatusCodes.BAD_REQUEST)
    }
    const user = await User.findOne({ username: username, password })

    if (!user) { throw new CustomAPIError('User does not exist or wrong password', StatusCodes.UNAUTHORIZED) }

    const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_TOKEN_KEY, { expiresIn: '15m' })

    const refreshToken = jwt.sign({ username: user.username }, process.env.JWT_REFRESH_KEY, { expiresIn: '7d' })

    await refreshTokenMap.findOneAndUpdate(
        { username: user.username },
        { token: refreshToken },
        { upsert: true, new: true }
    )

    res.status(200).json({ message: `user ${user.username} is now logged in`, accessToken: accessToken, refreshToken: refreshToken })
}

const dashboard = (req, res) => {
    const luckyNumber = Math.floor(Math.random() * 100)
    res.status(StatusCodes.OK).send(`Hello ${req.user} your luckyNumber is: ${luckyNumber}`)
}

const refresh = async (req, res) => {
    const user = await User.findOne({ username: req.user })
    if (!user) { throw new CustomAPIError('User not found in the database', StatusCodes.NOT_FOUND) }
    const accessToken = jwt.sign(
        { id: req.userId, username: req.user, role: req.role },
        process.env.JWT_TOKEN_KEY,
        { expiresIn: '15m' }
    )

    res.status(StatusCodes.OK).json({
        user: `${user.username}`,
        message: `Your new access token is generated.`,
        token: `${accessToken}`
    })

}

const logout = async (req, res) => {
    await blacklistedTokenMap.create({ token: req.token })

    if (req.user) {

        await refreshTokenMap.findOneAndDelete({ username: req.user })
    }
    res.json({ message: 'Logged out successfully' })
}

const admin = (req, res) => {
    if (req.role !== 'admin') {
        throw new CustomAPIError('You are not authorized. This is Admin only route', StatusCodes.UNAUTHORIZED)
    } else {
        res.status(StatusCodes.OK).json({ message: 'This is the admin dashboard' })
    }
}


module.exports = {
    login,
    dashboard,
    refresh,
    logout,
    admin,
}