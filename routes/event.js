const route             = require('express').Router()
const EventController   = require('../controllers/EventController');
const upload            = require('../middlewares/unggah')

route.get('/', EventController.listEvents);
route.get('/:id', EventController.findEventById);
route.post('/', upload.single('photo'), EventController.addEvent);
route.put('/:id', EventController.updateEvent);
route.delete('/:id', EventController.deleteEvent);

module.exports = route
