const mongoose = require('mongoose')

const refreshTokenSchema = mongoose.Schema({
    token: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' },
})



module.exports = mongoose.model('refreshToken', refreshTokenSchema)