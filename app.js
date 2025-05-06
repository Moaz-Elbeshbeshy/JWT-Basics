require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const mainRouter = require('./routes/main')

const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

app.use(express.json())
app.use(express.static('./public'))

app.use('/api/v1/', mainRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000
const start = async () => {
    try {
        // connect to database
        app.listen(port, () =>
            console.log(`app is listenning on port ${port}....`)
        )
    } catch (error) {
        console.log(error)
    }
}


start()