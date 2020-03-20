const route = require('express').Router()
const UserRouter = require('./UserRouter')

route.use('/users', UserRouter)

module.exports = route