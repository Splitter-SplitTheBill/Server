const mongoose  = require('mongoose');
const ObjectId  = mongoose.Types.ObjectId;

const route      = require('express').Router()
const Event      = require('../models/event');

route.get('/', async(req, res) => {
    const events = await Event.find({});
    res.status(200).json({
        events
    });
});

route.get('/:id', async(req, res) => {
    const event = await Event.findOne({_id: ObjectId(req.params.id)});
    res.status(200).json({
        event
    });
});

route.post('/', async (req, res) => {
    const { name, status, participants, accounts, createdUserId } = req.body;

    const event = new Event({ name, status, participants, accounts, createdUserId });
    // const resSave = await event.save();
    await event.save();
    
    res.status(201).json({
        message: 'Event has been added'
    });
});

route.put('/:id', async (req, res) => {
    const { name, status, participants, accounts, createdUserId } = req.body;

    const resUpdate = await Event.updateOne({_id: ObjectId(req.params.id)}, { name, status, participants, accounts, createdUserId });
    res.status(200).json({
        resUpdate
    });
});

route.delete('/:id', async (req, res) => {
    const resDelete = await Event.deleteOne({_id: ObjectId(req.params.id)});
    res.status(200).json({resDelete});
});

module.exports = route
