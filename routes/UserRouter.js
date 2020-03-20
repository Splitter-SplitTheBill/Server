const route = require('express').Router()
const UserController = require('../controllers/UserController')
const { authentication }  = require('../middlewares/authentication')
const { authorizationUserId } = require('../middlewares/authorizationUserId')
const { authorizationUserName } = require('../middlewares/authorizationUserName')

route.post('/login', UserController.login)
route.post('/register', UserController.register)

route.use(authentication)
route.get('/:id', authorizationUserId, UserController.readOneId)
route.put('/:id', authorizationUserId, UserController.update)
route.get('/username/:username', authorizationUserName, UserController.readOneUserName)

module.exports = route