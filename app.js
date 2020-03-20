if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const router = require('./routes')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')

app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .use('/', router)
    .use(errorHandler)

module.exports = app
