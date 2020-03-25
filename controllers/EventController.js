const Event         = require('../models/event');
const mongoose      = require('mongoose');
const ObjectId      = mongoose.Types.ObjectId;
const { getItems }  = require('../helpers/extractText');
const transactionModel = require('../models/transaction')

class EventController {
    static listEvents(req, res, next) {
        let createdUserId = req.userLoggedIn ? req.userLoggedIn._id : "123456789012";
        Event.find({createdUserId})
                    .populate('createdUserId', 'name email username image_url')
                    .populate('participants.transactionId')
                    .populate('participants.participantId', 'name email username image_url')
            .then(events => {
                res.status(200).json({
                    events
                });
            })
            .catch(next);
    }

    static findEventById(req, res, next) {
        Event.findOne({_id: ObjectId(req.params.id)})
                    .populate('createdUserId', 'name email username image_url')
                    .populate('participants.transactionId')
                    .populate('participants.participantId', 'name email username image_url')
            .then(event => {
                res.status(200).json({
                    event
                });
            })
            .catch(next);
    }

    static addEvent(req, res, next) {
        let newEvent
        let returnTransactions
        const { name, photo, accounts, createdUserId } = req.body;
        const event = new Event({ name, photo, status: false, participants: [], accounts, createdUserId });
        
        event.save()
            .then((createdEvent) => {
                newEvent = createdEvent
                let transactions = []
                req.body.participants.forEach(participant => {
                    let totalTransaction = 0
                    participant.items.forEach(item => {
                        totalTransaction += item.price
                    })
                    transactions.push(transactionModel.create({
                        userId: participant.userId,
                        items: participant.items,
                        total: totalTransaction,
                        status: 'unpaid',
                        paymentSelection: newEvent.accounts,
                        eventId: newEvent._id
                    }))
                })
                return Promise.all(transactions)
            })
            .then(createdTransactions => {
                returnTransactions = createdTransactions
                let fixedParticipants = []
                createdTransactions.forEach(transaction => {
                    fixedParticipants.push({participantId: transaction.userId, transactionId: transaction._id})
                })
                return Event.updateOne({
                    _id: newEvent._id
                }, {
                    participants: fixedParticipants
                })
            })
            .then(updatedData => {
                return Event.findOne({
                    _id: newEvent._id
                })
                .populate('participants.transactionId')
                .populate('participants.participantId', 'name email username image_url')
            })
            .then(finalEventData => {
                res.status(201).json({
                    event: finalEventData,
                    transactions: returnTransactions
                })
            })
            .catch(next)
    } 

    static updateEvent(req, res, next) {
        const { name, photo, status, participants, accounts, createdUserId } = req.body;

        Event.updateOne({_id: ObjectId(req.params.id)}, { name, photo, status, participants, accounts, createdUserId })
            .then(resUpdate => {
                res.status(200).json({
                    resUpdate
                });            
            })
            .catch(next);
    }

    static deleteEvent(req, res, next) {
        Event.deleteOne({_id: ObjectId(req.params.id)})
            .then(resDelete => {
                res.status(200).json({resDelete});
            })
            .catch(next);
    }

    static imgToArrTransactions(req, res, next) {
        // console.log(req.body.photo)
        getItems(req.body.photo)
        // getItems('https://storage.cloud.google.com/forocrtest/1585043446579-test.jpg')
        .then(transactions => {
            // console.log(transactions)
                res.status(200).json({
                    transactions,
                    photo: req.body.photo
                });
            })
            .catch(err => {
                res.status(400).json({
                    message: 'Transaction not found',
                    err
                });
            })
    }
}

module.exports = EventController;