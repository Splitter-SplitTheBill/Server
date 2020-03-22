const request = require('supertest')
const app = require('../app')
const ObjectId = require('mongoose').Types.ObjectId;
const TransactionModel = require('../models/transaction')
let transactionMock
let userMock = {
    _id: ObjectId('5e77191f97ed86369f7d2bfa')
}
let eventMock

beforeAll((done) => {
    request(app)
        .post('/events')
        .send({
            name: 'Makan nasi padang dipondok indah',
                photo: "www.poto.com",
                participants: [
                    {
                        participantId: ObjectId("123456789012"),
                        transactionId: ObjectId("123456789012")
                    },
                    {
                        participantId: ObjectId("123456789012"),
                        transactionId: ObjectId("123456789012")
                    }
                ],
                accounts: [
                    {
                        name: "BCA",
                        instance: "A/n Ucok",
                        accountNumber: "65301298391"
                    },
                    {
                        name: "Ovoo",
                        instance: "A/n 0812039012",
                        accountNumber: "0812039012"
                    },
                    {
                        name: "Gopay",
                        instance: "A/n 0812039012",
                        accountNumber: "0812039012"
                    },
                ],
                createdUserId: '5e77191f97ed86369f7d2bff'
        })
        .end((err, res) => {
            if(err) done(err)
            eventMock = res.body.event
            transactionMock = res.body.transactions[0]
            done()
        })
});

describe('GET /transactions/:transactionId (SUCCESS)', () => {
    it('should return status(200) and object containing transaction details', (done) => {
        request(app)
            .get('/transactions/' + transactionMock._id)
            .expect(200)
            .end((err, res) => {
                if (err) done(err)
                expect(res.body).toHaveProperty('_id')
                expect(res.body).toHaveProperty('userId')
                expect(res.body).toHaveProperty('total')
                expect(res.body).toHaveProperty('status')
                expect(res.body).toHaveProperty('eventId')
                expect(res.body).toHaveProperty('paymentSelection')
                done()
            })
    })
})

describe('GET /transactions/:transactionId (Error)', () => {
    it('should return status(200) and object containing transaction details', (done) => {
        request(app)
            .get('/transactions/5e748b8d3263399d9d7c255f')
            .expect(404)
            .end((err, res) => {
                if (err) done(err)
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toBe('Transaction Not Found')
                done()
            })
    })
})

describe('GET /transactions/event/:eventId (SUCCESS)', () => {
    it('should return status(200) and object containing transaction details', (done) => {
        request(app)
            .get('/transactions/event/' + eventMock._id)
            .expect(200)
            .end((err, res) => {
                if (err) done(err)
                expect(res.body).toHaveProperty('_id')
                expect(res.body).toHaveProperty('userId')
                expect(res.body).toHaveProperty('total')
                expect(res.body).toHaveProperty('status')
                expect(res.body).toHaveProperty('eventId')
                expect(res.body).toHaveProperty('paymentSelection')
                done()
            })
    })
})

describe('GET /transactions/event/:eventId (Error)', () => {
    it('should return status(200) and object containing transaction details', (done) => {
        request(app)
            .get('/transactions/event/5e748b8d3263399d9d7c255f')
            .expect(404)
            .end((err, res) => {
                if (err) done(err)
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toBe('Transaction Not Found')
                done()
            })
    })
})

describe('GET /transactions/user/:userId (SUCCESS)', () => {
    it('should return status(200) and object containing transaction details', (done) => {
        request(app)
            .get('/transactions/user/' + userMock._id)
            .expect(200)
            .end((err, res) => {
                if (err) done(err)
                expect(res.body[0]).toHaveProperty('_id')
                expect(res.body[0]).toHaveProperty('userId')
                expect(res.body[0]).toHaveProperty('total')
                expect(res.body[0]).toHaveProperty('status')
                expect(res.body[0]).toHaveProperty('eventId')
                expect(res.body[0]).toHaveProperty('paymentSelection')
                done()
            })
    })
})

describe('GET /transactions/user/:userId (Error)', () => {
    it('should return status(200) and object containing transaction details', (done) => {
        request(app)
            .get('/transactions/user/5e748b8d3263399d9d7c255f')
            .expect(404)
            .end((err, res) => {
                if (err) done(err)
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toBe(`You don't have any transactions yet`)
                done()
            })
    })
})


describe('PATCH /transactions/:eventId/:userId (SUCCESS)', () => {
    it('should return status(200) and object containing number of modified data', (done) => {
        request(app)
            .patch(`/transactions/${eventMock._id}/${userMock._id}`)
            .expect(200)
            .end((err, res) => {
                if (err) done(err)
                expect(res.body).toHaveProperty('nModified')
                done()
            })
    })
})

describe('PATCH /transactions/:eventId/:userId (Error)', () => {
    it('should return status(404) and object containing message', (done) => {
        request(app)
            .patch('/transactions/5e748b8d3263399d9d7c255f/5e748b8d3263399d9d7c255f')
            .expect(404)
            .end((err, res) => {
                if (err) done(err)
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toBe('Transaction Not Found')
                done()
            })
    })
})

afterAll( async () => {
    await TransactionModel.deleteMany()
})