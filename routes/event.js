const route             = require('express').Router()
const EventController   = require('../controllers/EventController');
const upload            = require('../middlewares/unggah')
const { authentication }  = require('../middlewares/authentication')

route.get('/', authentication, EventController.listEvents);
route.get('/:id', EventController.findEventById);
route.post('/', EventController.addEvent);
route.post('/ocr', upload.single('photo'), EventController.imgToArrTransactions);
route.put('/:id', EventController.updateEvent);
route.delete('/:id', EventController.deleteEvent);

module.exports = route
