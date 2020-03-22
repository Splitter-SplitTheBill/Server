const User = require('../models/user');
const bcrypt = require('../helpers/bcrypt');
const { generateToken } = require('../middlewares/jwt');

class UserController {
    static register(req, res, next) {
        const { name, email, username, password, accounts, friendList, photo } = req.body;
        User.create({
            name,
            email,
            username,
            password,
            accounts,
            friendList,
            photo
        })
        .then(user => {
            const token = generateToken({ _id: user._id, email: user.email });
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                accounts: user.accounts,
                friendList: user.friendList,
                token: token
            });
        })
        .catch(err => {
            // let arrayMessage = err.message.split(',')
            // let newArrayMessage = []
            // arrayMessage.map(msg => {
            //     newArrayMessage.push(msg.trim().split(':'))
            // })
            // console.log('arr',newArrayMessage)
            next({ status: 400, message: err.message })
        });
    }

    static login(req, res, next) {
        const { username, password } = req.body;
        User.findOne({ username })
        .then(user => {
            if(!user) {
                next({ status: 404, message: 'username/password wrong'})
            } else {
                if(bcrypt.compareHash(password, user.password)) {
                    const token = generateToken({ _id: user._id, email: user.email });
                    res.status(200).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        accounts: user.accounts,
                        friendList: user.friendList,
                        token: token
                    });
                } else {
                    next({ status: 404, message: 'username/password wrong'});
                }
            }
        })
        .catch(next)
    }

    static readOneId(req, res, next) {
        const id = req.params.id;
        User.findById(id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(next)
    }

    static readOneUserName(req, res, next) {
        const username = req.params.username;
        User.findOne({ username })
        .then(user => {
            res.status(200).json(user);
        })
        .catch(next)
    }

    static update(req, res, next) {
        const id = req.params.id
        const { name, accounts, friendList } = req.body;
        User.findByIdAndUpdate(
            {
                _id: id
            },
            {
                name,
                accounts,
                friendList
            }
        )
        .then(user => {
            res.status(200).json(user);
        })
        .catch(next)
    }

    static addAccount(req, res, next) {
        // /users/:id/accounts
        const id = req.params.id
        const { name, instance, accountNumber } = req.body
        let duplicateData = false

        User.findById(id)
        .then(user => {
            if(user) {
                user.accounts.map(element => {
                    if(element.name == name && element.instance == instance && element.accountNumber == accountNumber) {
                        duplicateData = true
                    }
                })
                if(!duplicateData) {
                    return User.update(
                        {
                            _id: id
                        },
                        {
                            $push: {
                                accounts: {
                                    name,
                                    instance,
                                    accountNumber
                                }
                            }
                        }
                    )
                    .then(userUpdated => {
                        res.status(200).json({
                            succeeded: {
                                name,
                                instance,
                                accountNumber
                            }
                        })
                    })
                } else {
                    next({ status: 400, message: 'All data already exist' })
                }
            } else {
                next({ status: 400, message: 'Data not found' })
            }
        })
        .catch(next)
    }

    static removeAccount(req, res, next) {
        // /users/:id/accounts/accountId
        const id = req.params.id
        const accountId = req.params.accountId
        let accountIdFound = false
        let successRemove = {}

        User.findById(id)
        .then(user => {
            if(user) {
                user.accounts.map(el => {
                    if(el._id.equals(accountId)) {
                        accountIdFound = true
                        successRemove = {
                            _id: el._id,
                            name: el.name,
                            instance: el.instance,
                            accountNumber: el.accountNumber
                        }
                    }
                })
                if(accountIdFound) {
                    return User.update(
                        {
                            _id: id
                        },
                        {
                            $pull: {
                                accounts: {
                                    _id: accountId
                                }
                            }
                        }
                    )
                } else {
                    next({ status: 400, message: 'AccountId not found' })
                }
            } else {
                next({ status: 400, message: 'UserId not found' })
            }
        })
        .then(success => {
            res.status(200).json(successRemove)
        })
        .catch(next)
    }

    static addFriend(req, res, next) {
        // /users/:id/friends
        const id = req.params.id
        const { friendId } = req.body
        let friendFound = false
    
        User.findById(id)
        .then(user => {
            if(user) {
                user.friendList.map(el => {
                    if(el.userId.equals(friendId)) {
                        friendFound = true
                    }
                })
                if(friendFound) {
                    next({ status: 400, message: 'Data already exist' })
                } else {
                    return User.update(
                        {
                            _id: id
                        },
                        {
                            $push: {
                                friendList: {
                                    userId: friendId
                                }
                            }
                        }
                    )
                }
            } else {
                next({ status: 400, message: 'UserId not found' })
            }
        })
        .then(success => {
            res.status(200).json({success, userId: friendId})
        })
        .catch(next)
    }

    static removeFriend(req, res, next) {
        // /users/:id/friends/:friendId
        const id = req.params.id
        const friendId = req.params.friendId
        let userIdFound = false

        User.findById(id)
        .then(user => {
            if(user) {
                user.friendList.map(el => {
                    if(el.userId.equals(friendId)) {
                        console.log(el.userId)
                        userIdFound = true
                    }
                })
                if(userIdFound) {
                    return User.update(
                        {
                            _id: id
                        },
                        {
                            $pull: {
                                friendList: {
                                    userId: friendId
                                }
                            }
                        }
                    )
                } else {
                    next({ status: 400, message: 'FriendId not found' })
                }
            } else {
                next({ status: 400, message: 'UserId not found' })
            }
        })
        .then(success => {
            res.status(200).json({success, userId: friendId})
        })
        .catch(next)
    }
}

module.exports = UserController;