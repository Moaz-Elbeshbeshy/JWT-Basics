const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/verify-token')
const verifyRefresh = require('../middleware/verify-refresh')
const { login, dashboard, refresh, logout, admin } = require('../controller/main')


router.route('/login').post(login)
router.route('/protected').get(verifyToken, dashboard)
router.route('/refresh').post(verifyRefresh, refresh)
router.route('/logout').post(verifyRefresh, logout)
router.route('/admin').get(verifyToken, admin)


module.exports = router