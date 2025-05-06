const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { login, dashboard } = require('../controller/main')


router.route('/login').post(login)
router.route('/dashboard').get(authMiddleware, dashboard)


module.exports = router