require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const mainRouter = require('./routes/main')

const app = express()
const port = 3000

// Middleware to parse JSON
app.use(express.json())


// routes
app.use('/api/v1', mainRouter)



// we create an admin route where only the admin role can access



const start = (port) => {
    try {
        app.listen(port, () => {
            console.log(`Server running on port: ${port}...`)
        })
    } catch (error) {
        console.error('Failed to connect to server:', error.message)
    }
}

start(port || process.env.PORT)