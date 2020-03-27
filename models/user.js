const mongoose = require('mongoose');
const bcrypt = require('../helpers/bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        validate: {
            validator: function(email) {
                return User.findOne({
                    email
                })
                .then(result => {
                    if(result) {
                        return false;
                    } else {
                        return true;
                    }
                })
                .catch()
            },
            message: 'Email already exist'
        }
    },
    username: {
        type: String,
        required: true,
        validate: {
            validator: function(username) {
                return User.findOne({
                    username
                })
                .then(result => {
                    if(result) {
                        return false;
                    } else {
                        return true;
                    }
                })
                .catch()
            },
            message: 'Username already exist'
        }
    },
    password: {
        type: String,
        required: true
    },
    accounts: [{
        name: {
            type: String
        },
        instance: {
            type: String
        },
        accountNumber: {
            type: String
        }
    }],
    friendList: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    image_url: {
        type: String
    }
});

UserSchema.pre('save', function(next) {
    this.password = bcrypt.generateHash(this.password);
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
