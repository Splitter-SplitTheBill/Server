const route = require('express').Router()
const UserController = require('../controllers/UserController')
const { authentication }  = require('../middlewares/authentication')
const { authorizationUserId } = require('../middlewares/authorizationUserId')
const { authorizationUserName } = require('../middlewares/authorizationUserName')

route.post('/login', UserController.login)
route.post('/register', UserController.register)

route.use(authentication)
route.get('/:id', authorizationUserId, UserController.readOneId)
route.patch('/:id', authorizationUserId, UserController.update)
route.get('/username/:username', authorizationUserName, UserController.readOneUserName)
route.patch('/:id/accounts', UserController.addAccount)
route.patch('/:id/accounts/:accountId', UserController.removeAccount)
route.patch('/:id/friends', UserController.addFriend)
route.patch('/:id/friends/:friendId', UserController.removeFriend)

module.exports = route