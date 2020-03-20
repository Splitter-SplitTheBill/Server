const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    status: {
        type: String
    },
    participants: {
        type: [String]
    },
    accounts: {
        type: [String]
    },
    createdUserId: {
        type: Number
    }
});

module.exports = mongoose.model('Event', eventSchema);