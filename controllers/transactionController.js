const transactionModel = require('../models/transaction')
const eventModel = require('../models/event')
var mongoose = require('mongoose');

class TransactionController {
    static findTransactionByID (req, res, next) {
        transactionModel.findById(req.params.transactionId).populate('userId', 'name email username image_url').populate('eventId')
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
        }).populate('userId', 'name email username image_url').populate('eventId')
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
        }).populate('userId', 'name email username image_url').populate('eventId')
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
            status: req.body.status.toLowerCase()
        })
        .then(updatedTransaction => {
            if (updatedTransaction.nModified) {
                return eventModel.findOne({
                    _id: req.params.eventId
                }).populate('participants.transactionId').populate('participants.participantId', 'name email username image_url')
            } else {
                throw ({
                    status: 404,
                    message: 'Transaction Not Found'
                })
            }
        })
        .then(updatedEventData => {
            console.log(updatedEventData, '<<<<<<<<<<<<<')
            res.status(200).json(updatedEventData)
        })
        .catch(err => {
            next(err)
        })
    }

}

module.exports = TransactionController