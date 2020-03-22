const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const eventSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    photo: {
        type: String
    },  
    status: {
        type: String
    },
    participants: {
        type: [{
            participantId: {
                type: ObjectId,
                ref: 'User'
            },
            transactionId: {
                type: ObjectId,
                ref: 'Transaction'
            }
        }]
    },
    accounts: {
        type: [{
            name: {
                type: String
            },
            instance: {
                type: String
            },
            accountNumber: {
                type: String
            }
        }]
    },
    createdUserId: {
        type: ObjectId
    }
});

module.exports = mongoose.model('Event', eventSchema);