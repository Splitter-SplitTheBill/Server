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
})

const Event     = require('../models/event');
const User      = require('../models/user');

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


beforeAll(async () => {
    // Connect to a Mongo DB
    try {
        const url = `mongodb://127.0.0.1:27017/${dbName}`;
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });          
    } catch (error) {
        console.log(`database error connecting...`);
        console.log(error);
    }
});


describe('Register & Login', () => {
    it('should return status(201) and object containing user data', (done) => {
        request.post('/users/register')
        .send(registerOne)
        .expect(201)
        .end((err, res) => {
            if(err) return done(err)
            expect(typeof res.body).toBe('object')
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name')
            expect(res.body).toHaveProperty('email')
            expect(res.body).toHaveProperty('username')
            expect(res.body).toHaveProperty('accounts')
            expect(res.body).toHaveProperty('friendList')
            expect(res.body).toHaveProperty('image_url')
            expect(res.body).toHaveProperty('token')
            done()
        })
    })    
    it('should return status(200) and object containing user data', (done) => {
        request.post('/users/login')
        .send({
            username: registerOne.username,
            password: registerOne.password
        })
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            userId = res.body._id
            username = res.body.username
            token = res.body.token
            accountId = res.body.accounts[0]._id
            expect(typeof res.body).toBe('object')
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name')
            expect(res.body).toHaveProperty('email')
            expect(res.body).toHaveProperty('username')
            expect(res.body).toHaveProperty('accounts')
            expect(res.body).toHaveProperty('friendList')
            expect(res.body).toHaveProperty('image_url')
            expect(res.body).toHaveProperty('token')
            done()
        })
    })
});

describe('Testing API Event (CRUD)', () => {
    it('Should return all events from database', async done => {
        const response = await request.get('/events');
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('events');
    
        done();
    });
    
    it('Should return an event from database', async done => {
        const response = await request.get('/events/4edd40c86762e0fb12000003');
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('event');
    
        done();
    });
    
    it('should save event to database', async done => {
        const response = await request.post('/events')
            .send({
                name: 'Makan nasi padang dipondok indah',
                photo: "gs://split-bill-bucket/1.jpg",
                participants: [
                    {
                        participantId: ObjectId("123456789012"),
                        transactionId: ObjectId("123456789012"),
                        items: []
                    },
                    {
                        participantId: ObjectId("123456789012"),
                        transactionId: ObjectId("123456789012"),
                        items: []
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
                createdUserId: ObjectId("123456789012")
            });
    

        const event = await Event.findOne({
            createdUserId: ObjectId("123456789012")
        });
    
        expect(response.status).toBe(201);

        expect(event._id).toBeTruthy();
        expect(event.name).toBeTruthy();
        expect(event.createdUserId).toBeTruthy();
        expect(event.participants).toBeTruthy();
        expect(event.accounts).toBeTruthy();
        
        done();
    });
    
    it('should update event to database', async done => {
        const response = await request.put('/events/4edd40c86762e0fb12000003')
            .send({
                name: 'Makan nasi padang dipondok ungu',
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
                createdUserId: ObjectId("123456789012")
            });
    
            expect(response.status).toBe(200);
            expect(response.body.resUpdate).toHaveProperty('ok');
    
            done();
    });
    
    it('should delete event from database', async done => {
        const response = await request.delete('/events/4edd40c86762e0fb12000003');
    
        expect(response.status).toBe(200);
        expect(response.body.resDelete).toHaveProperty('ok');    
        
        done();
    });
});   

describe('POST /events/ocr - success', () => {
    it('should return status(200) and an array of object transactions and photo url', (done) => {
        jest.setTimeout(60000);

        request.post('/events/ocr')
            .send({
                photo: "gs://split-bill-bucket/1.jpg"
            })
            .expect(200)
            .end((err, response) => {
                console.log(response.body);
                expect(response.body).toHaveProperty('transactions');
                expect(response.body).toHaveProperty('photo');
                setTimeout(() => {                    
                    done();        
                }, 1000);
            })        
    });
});

afterAll(async () => {
    await Event.deleteMany();
    await User.deleteMany();
    // await mongoose.connection.close();
})