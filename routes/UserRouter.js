const route = require('express').Router()
const UserController = require('../controllers/UserController')
const { authentication }  = require('../middlewares/authentication')
// const { authorizationUserId } = require('../middlewares/authorizationUserId')
// const { authorizationUserName } = require('../middlewares/authorizationUserName')
const upload = require('../middlewares/unggah')

route.post('/login', UserController.login)
route.post('/register', upload.single('image_url'), UserController.register)

route.use(authentication)
route.get('/:id', UserController.readOneId)
route.patch('/:id', upload.single('image_url'), UserController.update)
route.get('/username/:username', UserController.readOneUserName)
route.patch('/:id/accounts', UserController.addAccount)
route.patch('/:id/accounts/:accountId', UserController.removeAccount)
route.patch('/:id/friends', UserController.addFriend)
route.patch('/:id/friends/:friendId', UserController.removeFriend)

module.exports = route