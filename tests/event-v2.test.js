const request = require('supertest')
const app = require('../app')
const UserModel = require('../models/user')
const EventModel = require('../models/event')
const ObjectId = require('mongoose').Types.ObjectId;

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
let token_1

beforeAll((done) => {
    request(app)
    .post('/users/register')
    .send(registerOne)
    .end((err, res) => {
        if(err) return done(err)
        userId_1 = res.body._id
        token_1 = res.body.token
        setTimeout(() => {
            done();
        }, 1500);
    })

    request(app)
    .post('/users/register')
    .send(registerTwo)
    .end((err, res) => {
        if(err) return done(err)
        userId_2 = res.body._id
        setTimeout(() => {
            done();
        }, 1500);
    })
})
userId_1 = ObjectId(userId_1)
userId_2 = ObjectId(userId_2)
let eventData = {
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
}
let eventId
describe('POST /events - success', () => {
    it('should return status(201) and an object of event and transaction data', (done) => {
        request(app)
        .post('/events')
        .send(eventData)
        .expect(201)
        .end((err, res) => {
            if(err) return done(err)
            eventId = res.body.event._id
            expect(typeof res.body.event).toBe('object')
            expect(res.body.event).toHaveProperty('_id')
            expect(res.body.event).toHaveProperty('name')
            expect(res.body.event).toHaveProperty('photo')
            expect(res.body.event).toHaveProperty('status')
            expect(res.body.event).toHaveProperty('participants')
            expect(typeof res.body.event.participants).toBe('object')
            expect(res.body.event).toHaveProperty('accounts')
            expect(typeof res.body.event.accounts).toBe('object')

            expect(typeof res.body.transactions).toBe('object')
            expect(res.body.transactions[0]).toHaveProperty('_id')
            expect(res.body.transactions[0]).toHaveProperty('eventId')
            expect(res.body.transactions[0]).toHaveProperty('total')
            expect(res.body.transactions[0]).toHaveProperty('status')
            expect(res.body.transactions[0]).toHaveProperty('items')
            expect(typeof res.body.transactions[0].items).toBe('object')
            expect(res.body.transactions[0]).toHaveProperty('paymentSelection')
            expect(typeof res.body.transactions[0].paymentSelection).toBe('object')
            
            setTimeout(() => {
                done();
            }, 1000);
        })
    })
})

describe('GET /events - success', () => {
    it('should return status(200) and an object of events', (done) => {
        request(app)
        .get('/events')
        .set('token', token_1)
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('events');
            // setTimeout(() => {
                done();
            // }, 1500);
        })
    })
})

describe('GET /events/:eventId - success', () => {
    it('should return status(200) and an object of event', (done) => {
        request(app)
        .get(`/events/${eventId}`)
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('event')
            expect(res.body.event).toHaveProperty('_id')
            expect(res.body.event).toHaveProperty('name')
            expect(res.body.event).toHaveProperty('photo')
            expect(res.body.event).toHaveProperty('status')
            expect(res.body.event).toHaveProperty('participants')
            expect(typeof res.body.event.participants).toBe('object')
            expect(res.body.event).toHaveProperty('accounts')
            expect(typeof res.body.event.accounts).toBe('object')
            // setTimeout(() => {
                done();
            // }, 1500);
        })
    })
})

describe('PUT /events/:eventId - success', () => {
    it('should return status(200) and an object contain success property', (done) => {
        request(app)
        .put(`/events/${eventId}`)
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('resUpdate')
            expect(res.body.resUpdate).toHaveProperty('nModified')
            // setTimeout(() => {
                done();
            // }, 1500);
        })
    })
})

describe('DELETE /events/:eventId - success', () => {
    it('should return status(200) and an object contain success property', (done) => {
        request(app)
        .delete(`/events/${eventId}`)
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('resDelete')
            expect(res.body.resDelete).toHaveProperty('deletedCount')
            // setTimeout(() => {
                done();
            // }, 1500);
        })
    })
})

describe('POST /events/ocr - success', () => {
    it('should return status(200) and an array of object transactions and photo url', (done) => {
        jest.setTimeout(60000);

        request(app)
        .post('/events/ocr')
        .send({
            photo: linkImage
        })
        .expect(200)
        .end((err, response) => {
            expect(response.body).toHaveProperty('transactions');
            expect(response.body).toHaveProperty('photo');
            // setTimeout(() => {
                done();
            // }, 1000);
        })        
    });
});

afterAll(async () => {
    await UserModel.deleteMany();
    await EventModel.deleteMany();
});