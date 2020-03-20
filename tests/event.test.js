const mongoose  = require('mongoose');
mongoose.set('bufferCommands', false);

const app       = require('../app');
const supertest = require('supertest');
const request   = supertest(app);

const dbName    = 'splitbill';

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
            participants: [
                "Udin",
                "Kosasih",
                "Pak Kirwan"
            ],
            accounts: [
                "BCA",
                "Ovoo",
                "gOPAY"
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
            participants: [
                "Udin",
                "Kosasih"
            ],
            accounts: [
                "BCA",
                "Ovoo"
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


afterAll(async () => {
    await Event.deleteMany();
    // await mongoose.connection.close();
});