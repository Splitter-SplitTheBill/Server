const Event         = require('../models/event');
const mongoose      = require('mongoose');
const ObjectId      = mongoose.Types.ObjectId;
const { getItems }  = require('../helpers/extractText');

class EventController {
    static listEvents(req, res, next) {
        Event.find({})
            .then(events => {
                res.status(200).json({
                    events
                });
            })
            .catch(next);
    }

    static findEventById(req, res, next) {
        Event.findOne({_id: ObjectId(req.params.id)})
            .then(event => {
                res.status(200).json({
                    event
                });
            })
            .catch(next);
    }

    static addEvent(req, res, next) {
        let newEvent
        const { name, photo, status, participants, accounts, createdUserId } = req.body;
        const event = new Event({ name, photo, status, participants, accounts, createdUserId });
        event.save()
            .then((createdEvent) => {
                newEvent = createdEvent
                let transactions = []
                transactionData.forEach(transactionItem => {
                    transactions.push(transcationModel.create({
                        userId: '5e77191f97ed86369f7d2bfa',
                        items: [
                            {
                                name: 'Nasi Goreng',
                                qty: 1,
                                price: 11000
                            }
                        ],
                        total: 11000,
                        status: false,
                        paymentSelection: newEvent.accounts,
                        eventId: newEvent._id
                    }))
                })
                return Promise.all(transactions)
            })
            .then(createdTransactions => {
                res.status(201).json({
                    event: newEvent,
                    transactions: createdTransactions
                })
            })
            .catch(next);    
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
        getItems('https://pbs.twimg.com/media/BC4dRKCCEAAZoPr.jpg')
            .then(transactions => {
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