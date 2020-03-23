const transactionModel = require('../models/transaction')
const eventModel = require('../models/event')
var mongoose = require('mongoose');

class TransactionController {
    static findTransactionByID (req, res, next) {
        transactionModel.findById(req.params.transactionId).populate('userId').populate('eventId')
        .then(transactionData => {
            if (transactionData) {
                res.status(200).json(transactionData)
            } else {
                throw ({
                    status: 404,
                    message: 'Transaction Not Found'
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static findTransactionByEvent (req, res, next) {
        transactionModel.findOne({
            eventId: req.params.eventId
        }).populate('userId').populate('eventId')
        .then(transactionData => {
            if (transactionData) {
                res.status(200).json(transactionData)
            } else {
                throw ({
                    status: 404,
                    message: `Transaction Not Found`
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }
    

    static findTransactionByUser (req, res, next) {
        transactionModel.find({
            userId: req.params.userId
        }).populate('userId').populate('eventId')
        .then(transactionData => {
            if (transactionData.length > 0) {
                res.status(200).json(transactionData)
            } else {
                throw ({
                    status: 404,
                    message: `You don't have any transactions yet`
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static changeStatus (req, res, next) {
        transactionModel.updateOne({
            eventId: req.params.eventId,
            userId: req.params.userId
        },{
            status: true
        })
        .then(updatedTransaction => {
            if (updatedTransaction.nModified) {
                res.status(200).json(updatedTransaction)
            } else {
                throw ({
                    status: 404,
                    message: 'Transaction Not Found'
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }

}

module.exports = TransactionController