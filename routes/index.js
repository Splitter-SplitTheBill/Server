const route = require('express').Router()
<<<<<<< Updated upstream
const UserRouter = require('./UserRouter')

route.use('/users', UserRouter)
=======
const transactions = require('./transactions')

route.use('/transactions', transactions)
>>>>>>> Stashed changes

module.exports = route