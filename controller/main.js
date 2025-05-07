const jwt = require('jsonwebtoken')


const users = [
    { id: 1, username: 'user1', password: 'password1', role: 'user' },
    { id: 2, username: 'user2', password: 'password2', role: 'admin' },
]

const refreshTokens = new Map()
const blacklistedTokens = new Set()

const login = (req, res) => {
    const { username, password } = req.body
    if (!username || username.trim() === '' || !password || password.trim() === '') {
        return res.status(400).json({ message: 'Please provide a username and password' })
    }
    const user = users.find(u => u.username === username && u.password === password)
    if (!user) { return res.status(400).json({ message: 'User does not exist or wrong password' }) }

    const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_TOKEN_KEY, { expiresIn: '15m' })

    const refreshToken = jwt.sign({ username: user.username }, process.env.JWT_REFRESH_KEY, { expiresIn: '7d' })

    refreshTokens.set(user.username, refreshToken)

    res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken })
}

const dashboard = (req, res) => {
    const luckyNumber = Math.floor(Math.random() * 100)
    return res.status(200).send(`Hello ${req.user} your luckyNumber is: ${luckyNumber}`)
}

const refresh = (req, res) => {
    const user = users.find(u => u.username === req.user)
    if (!user) { return res.status(404).json({ message: 'user is not found in the database' }) }
    const accessToken = jwt.sign({ id: req.userId, username: req.user, role: req.role }, process.env.JWT_TOKEN_KEY, { expiresIn: '15m' })
    res.json({ message: `Your new access token is generated: ${accessToken}` })
}


const logout = (req, res) => {
    blacklistedTokens.add(req.token)
    if (req.user) {
        refreshTokens.delete(req.user)
    }
    res.json({ message: 'Logged out successfully' })
}

const admin = (req, res) => {
    if (req.role !== 'admin') {
        res.status(403).json({ message: 'You are not authorized. This is Admin only route' })
    } else {
        res.status(200).json({ message: 'This is the admin dashboard' })
    }
}


module.exports = {
    login,
    dashboard,
    refresh,
    logout,
    admin,
    blacklistedTokens,
    refreshTokens
}