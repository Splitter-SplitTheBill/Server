const User = require('../models/user');
const bcrypt = require('../helpers/bcrypt');
const { generateToken } = require('../middlewares/jwt');

class UserController {
    static register(req, res, next) {
        const { name, email, username, password, accounts, friendList } = req.body;
        User.create({
            name,
            email,
            username,
            password,
            accounts,
            friendList
        })
        .then(user => {
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
        })
        .catch(err => {
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
            if(!user) {
                next({ status: 404, message: 'Id wrong'})
            } else {
                res.status(200).json(user);
            }
        })
        .catch(next)
    }

    static readOneUserName(req, res, next) {
        const username = req.params.username;
        User.findOne({ username })
        .then(user => {
            if(!user) {
                next({ status: 404, message: 'username wrong'})
            } else {
                res.status(200).json(user);
            }
        })
        .catch(next)
    }

    static update(req, res, next) {
        const id = req.params.id
        const { name, email, username, password, accounts, friendList } = req.body;
        User.findByIdAndUpdate(
            {
                _id: id
            },
            {
                name,
                email,
                username,
                password,
                accounts,
                friendList
            }
        )
        .then(user => {
            res.status(200).json(user);
        })
        .catch(next)
    }

}

module.exports = UserController;