const route = require('express').Router()
const transactionController = require('../controllers/transactionController')

route.get('/user/:userId', transactionController.findTransactionByUser)

route.get('/event/:eventId', transactionController.findTransactionByEvent)

route.patch('/:eventId/:userId', transactionController.changeStatus)

route.get('/:transactionId', transactionController.findTransactionByID)

module.exports = route