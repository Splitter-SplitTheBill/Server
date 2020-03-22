const mongoose  = require('mongoose');
mongoose.set('bufferCommands', false);

const ObjectId = mongoose.Types.ObjectId;

const app       = require('../app');
const supertest = require('supertest');
const request   = supertest(app);

const dbName    = 'splitter-test';

const Event     = require('../models/event');

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
                createdUserId: 1
            });
    
        const event = await Event.findOne({
            createdUserId: 1
        });
    
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Event has been added');
    
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
                createdUserId: 1
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

describe('Testing OCR', () => {
    it('should return array of object transactions and photo url', ( done ) => {
        jest.setTimeout(60000);

        request.post('/events/ocr')
            .send({
                photo: "www.poto.com"
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
    // await mongoose.connection.close();
});