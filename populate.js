require('dotenv').config()
const connectDB = require('./db/connect')
const User = require('./models/users')
const usersList = require('./users.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await User.deleteMany()
        await User.create(usersList)
        console.log('Updated!!!!')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()