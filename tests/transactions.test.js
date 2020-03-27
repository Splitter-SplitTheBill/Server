const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const TransactionModel = require('../models/transaction')

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// let userMock = {
    // _id: ObjectId('5e77191f97ed86369f7d2bfa')
    // }
let eventMock
let transactionMock

const userModel = require('../models/user')
const eventModel = require('../models/event')
const linkImage = 'https://cdn.eso.org/images/screen/eso1907a.jpg'
let registerOne = {
    name: 'One Direction',
    email: 'one@mail.com',
    username: 'one',
    password: 'onedirection',
    accounts: [{ name: 'BCA', instance: 'BCA', accountNumber: '111111' },
                { name: 'OVO', instance: 'OVO', accountNumber: '222222' }],
    friendList: [{ userId: '5e7499e93c050e61249aeac7'}, { userId: '5e749f20ff201570c3629be0' }],
    image_url: linkImage
}
let registerTwo = {
    name: 'Two Direction',
    email: 'two@mail.com',
    username: 'two',
    password: 'twodirection',
    accounts: [{ name: 'BRI', instance: 'BRI', accountNumber: '333333' },
                { name: 'DANA', instance: 'DANA', accountNumber: '222222' }],
    friendList: [{ userId: '5e7499e93c050e61249aeac7'}, { userId: '5e749f20ff201570c3629be0' }],
    image_url: linkImage
}
let userId_1
let userId_2

beforeAll((done) => {
    request(app)
    .post('/users/register')
    .send(registerOne)
    .end((err, res) => {
        if(err) return done(err)
        userId_1 = res.body._id
    })

    request(app)
    .post('/users/register')
    .send(registerTwo)
    .end((err, res) => {
        if(err) return done(err)
        userId_2 = res.body._id
        done()
    })
})
userId_1 = ObjectId(userId_1)
userId_2 = ObjectId(userId_2)

beforeAll((done) => {
    request(app)
        .post('/events')
        .send({
            name: 'Makan nasi padang dipondok indah',
                photo: "www.poto.com",
                participants: [
                    {
                        userId: (userId_1),
                        items: [
                            {
                                item: 'nasi',
                                qty: 1,
                                price: 7000
                            },
                            {
                                item: 'rendang',
                                qty: 1,
                                price: 17000
                            }
                        ]
                    },
                    {
                        userId: (userId_2),
                        items: [
                            {
                                item: 'nasi',
                                qty: 1,
                                price: 7000
                            },
                            {
                                item: 'telor',
                                qty: 1,
                                price: 10000
                            }
                        ]
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
                createdUserId: (userId_1)
        })
        .end((err, res) => {
            if(err) done(err)
            eventMock = res.body.event
            transactionMock = res.body.transactions
            done()
        })
});

describe('GET /transactions/:transactionId (SUCCESS)', () => {
    it('should return status(200) and object containing transaction details', (done) => {
        request(app)
            .get('/transactions/' + transactionMock[0]._id)
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
            .get('/transactions/user/' + userId_1)
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
            .patch(`/transactions/${eventMock._id}/${userId_1}`)
            .send({ status: 'true' })
            .expect(200)
            .end((err, res) => {
                if (err) done(err)
                expect(typeof res.body).toBe('object')
                expect(res.body).toHaveProperty('_id')
                expect(res.body).toHaveProperty('name')
                expect(res.body).toHaveProperty('photo')
                expect(res.body).toHaveProperty('status')
                expect(res.body).toHaveProperty('participants')
                expect(typeof res.body.participants).toBe('object')
                expect(res.body).toHaveProperty('accounts')
                expect(typeof res.body.accounts).toBe('object')
                expect(res.body).toHaveProperty('createdUserId')
                done()
            })
    })
})

describe('PATCH /transactions/:eventId/:userId (Error)', () => {
    it('should return status(404) and object containing message', (done) => {
        request(app)
            .patch('/transactions/5e748b8d3263399d9d7c255f/5e748b8d3263399d9d7c255f')
            .send({ status: 'true' })
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
    await userModel.deleteMany()
    await eventModel.deleteMany()
})