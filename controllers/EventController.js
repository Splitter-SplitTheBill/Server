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
        const { name, photo, status, participants, accounts, createdUserId } = req.body;
        const event = new Event({ name, photo, status, participants, accounts, createdUserId });
        event.save()
            .then(() => {
                res.status(201).json({
                    message: 'Event has been added'
                });
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