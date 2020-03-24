const mongoose = require('mongoose')
const { Schema } = mongoose

const transactionsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: {
        type: [{
            name: {
                type: String
            },
            qty: {
                type: Number
            },
            price: {
                type: Number
            }
        }]
    },
    total: {
        type: Number
    },
    status: {
        type: Boolean
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    paymentSelection: [{
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
{
    timestamps: true
})

const transactions = mongoose.model('Transaction', transactionsSchema)

module.exports = transactions