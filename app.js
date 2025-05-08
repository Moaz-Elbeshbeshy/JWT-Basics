require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const connectDB = require('./db/connect')
const mainRouter = require('./routes/main')

const notFound = require('./errors/not-found')
const errorHandlerMiddleware = require('./errors/error-handler')


const app = express()
const port = 3000 || process.env.PORT

// Middleware to parse JSON
app.use(express.json())


// routes
app.use('/api/v1', mainRouter)


// Not found middleware
app.use(notFound)

// Global error handler
app.use(errorHandlerMiddleware)


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('Connected to DB')
        app.listen(port, () => {
            console.log(`Server running on port: ${port}...`)
        })
    } catch (error) {
        console.error('Failed to connect to server:', error.message)
    }
}

start()