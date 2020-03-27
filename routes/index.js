const route = require('express').Router()
const UserRouter = require('./UserRouter')
const transactions = require('./transactions')
const eventRoute = require('./event')

route.use('/users', UserRouter)
route.use('/transactions', transactions)
route.use('/events', eventRoute)

module.exports = route