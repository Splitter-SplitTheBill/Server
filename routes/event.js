const route             = require('express').Router()
const EventController   = require('../controllers/EventController');

route.get('/', EventController.listEvents);
route.get('/:id', EventController.findEventById);
route.post('/', EventController.addEvent);
route.put('/:id', EventController.updateEvent);
route.delete('/:id', EventController.deleteEvent);

module.exports = route
