const route = require('express').Router()
const UserRouter = require('./UserRouter')
const transactions = require('./transactions')

route.use('/users', UserRouter)
route.use('/transactions', transactions)

module.exports = route