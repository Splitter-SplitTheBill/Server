const route             = require('express').Router()
const EventController   = require('../controllers/EventController');
const upload            = require('../middlewares/unggah')
const { authentication }  = require('../middlewares/authentication')
const uploadGcs         = require('../middlewares/unggah-gcs');

route.get('/', EventController.listEvents);
route.get('/:id', EventController.findEventById);
route.post('/', EventController.addEvent);
route.post('/ocr', uploadGcs.single('photo'), EventController.imgToArrTransactions);
route.put('/:id', EventController.updateEvent);
route.delete('/:id', EventController.deleteEvent);

module.exports = route
