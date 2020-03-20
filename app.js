if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const router = require('./routes')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')
const mongoose = require('mongoose')
const mongodb = process.env.MONGO_ATLAS || 'mongodb://localhost:27017'
let dbName

if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
    dbName = 'splitter-' + process.env.NODE_ENV
}

mongoose.connect(mongodb+dbName, {useNewUrlParser:true, useUnifiedTopology: true})
.then(success => {
    console.log('connected to MongoDb on ' + mongodb+dbName)
})
.catch(err => {
    console.log(err)
})

app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .use('/', router)
    .use(errorHandler)

module.exports = app
