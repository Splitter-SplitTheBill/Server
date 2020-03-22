const request = require('supertest')
const app = require('../app')

let registerOne = {
    name: 'One Direction',
    email: 'one@mail.com',
    username: 'one',
    password: 'onedirection',
    accounts: [{ name: 'BCA', instance: 'BCA', accountNumber: '111111' },
                { name: 'OVO', instance: 'OVO', accountNumber: '222222' }],
    friendList: [{ userId: '5e7499e93c050e61249aeac7'}, { userId: '5e749f20ff201570c3629be0' }],
    image_url: './user.jpg'
}
let registerTwo = {
    name: 'Two Direction',
    email: 'two@mail.com',
    username: 'two',
    password: 'twodirection',
    accounts: [{ name: 'BRI', instance: 'BRI', accountNumber: '333333' },
                { name: 'DANA', instance: 'DANA', accountNumber: '222222' }],
    friendList: [{ userId: '5e7499e93c050e61249aeac7'}, { userId: '5e749f20ff201570c3629be0' }],
    image_url: './user.jpg'
}
let token
let userId
let username
let unauthorizeToken
let accountId
let friendId

beforeAll((done) => {
    request(app)
    .post('/users/register')
    .send(registerTwo)
    .end((err, res) => {
        unauthorizeToken = res.body.token
        done()
    })
})

//user test
describe('POST /users/register - success', () => {
    it('should return status(201) and object containing user data', (done) => {
        request(app)
        .post('/users/register')
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
            expect(res.body).toHaveProperty('token')
            done()
        })
    })
})
describe('POST /users/register - error email and username duplicate', () => {
    it('should return status(400) and error message: Email already exist and Username already exist', (done) => {
        request(app)
        .post('/users/register')
        .send({
            name: 'One Again',
            email: 'one@mail.com',
            username: 'one',
            password: 'oneagain',
            accounts: [{ name: 'BCA', instance: 'BCA', accountNumber: '111111' },
                        { name: 'OVO', instance: 'OVO', accountNumber: '222222' }],
            friendList: [{ userId: '5e7499e93c050e61249aeac7'}, { userId: '5e749f20ff201570c3629be0' }],
            image_url: './user.jpg'
        })
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toContain('Email already exist')
            expect(res.body.message).toContain('Username already exist')
            done()
        })
    })
})

describe('POST /users/login - success', () => {
    it('should return status(200) and object containing user data', (done) => {
        request(app)
        .post('/users/login')
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
            console.log(res.body.accounts)
            console.log('accountId',accountId)
            friendId = res.body.friendList[0].userId
            console.log('friendId', friendId)
            expect(typeof res.body).toBe('object')
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name')
            expect(res.body).toHaveProperty('email')
            expect(res.body).toHaveProperty('username')
            expect(res.body).toHaveProperty('accounts')
            expect(res.body).toHaveProperty('friendList')
            expect(res.body).toHaveProperty('token')
            done()
        })
    })
})
describe('POST /users/login - wrong username', () => {
    it('should return status(404) and an error message', (done) => {
        request(app)
        .post('/users/login')
        .send({
            username: 'Three',
            password: 'Three'
        })
        .expect(404)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toContain('username/password wrong')
            done()
        })
    })
})
describe('POST /users/login - wrong password', () => {
    it('should return status(404) and an error message', (done) => {
        request(app)
        .post('/users/login')
        .send({
            username: registerOne.username,
            password: 'Three'
        })
        .expect(404)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toContain('username/password wrong')
            done()
        })
    })
})

describe('GET /users:id - success', () => {
    it('should return status(200) and object containing user data', (done) => {
        request(app)
        .get(`/users/${userId}`)
        .set('token', token)
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            expect(typeof res.body).toBe('object')
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name')
            expect(res.body).toHaveProperty('email')
            expect(res.body).toHaveProperty('username')
            expect(res.body).toHaveProperty('accounts')
            expect(res.body).toHaveProperty('friendList')
            done()
        })
    })
})
describe('GET /users:id - missing token', () => {
    it('should return status(401) and error message', (done) => {
        request(app)
        .get(`/users/${userId}`)
        .expect(401)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toContain('You must log in first')
            done()
        })
    })
})
describe('GET /users:id - error token', () => {
    it('should return status(400) and error message from error handler', (done) => {
        request(app)
        .get(`/users/${userId}`)
        .set('token', 'token')
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toContain('Please login first')
            done()
        })
    })
})
describe('GET /users:id - invalid access token', () => {
    it('should return status(400) and error message', (done) => {
        request(app)
        .get(`/users/${userId}`)
        .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTc0OWYyMGZmMjAxNTcwYzM2MjliZTAiLCJlbWFpbCI6InBldGVyQG1haWwuY29tIiwiaWF0IjoxNTg0NzAxMjE2fQ.uQ-P0VO1c0zaghcN45ZMjBgvODMtl9_fy3Ph7vEm8Yk')
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toContain('Invalid access')
            done()
        })
    })
})
describe('GET /users:id - unauthorize token', () => {
    it('should return status(400) and error message', (done) => {
        request(app)
        .get(`/users/${userId}`)
        .set('token', unauthorizeToken)
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toContain('Unauthorize')
            done()
        })
    })
})
describe('GET /users:id - user id not found', () => {
    it('should return status(400) and error message', (done) => {
        request(app)
        .get(`/users/5e749f20ff201570c3629be1`)
        .set('token', token)
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toContain('Data not found')
            done()
        })
    })
})

describe('GET /users/username/:username - success', () => {
    it('should return status(200) and object containing user data', (done) => {
        request(app)
        .get(`/users/username/${username}`)
        .set('token', token)
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            expect(typeof res.body).toBe('object')
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name')
            expect(res.body).toHaveProperty('email')
            expect(res.body).toHaveProperty('username')
            expect(res.body).toHaveProperty('accounts')
            expect(res.body).toHaveProperty('friendList')
            done()
        })
    })
})
describe('GET /users/username/:username - unauthorize token', () => {
    it('should return status(400) and error message', (done) => {
        request(app)
        .get(`/users/username/${username}`)
        .set('token', unauthorizeToken)
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toContain('Unauthorize')
            done()
        })
    })
})
describe('GET /users/username/:username - username not found', () => {
    it('should return status(400) and error message', (done) => {
        request(app)
        .get(`/users/username/Peter`)
        .set('token', token)
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toContain('Data not found')
            done()
        })
    })
})

describe('PATCH /users/:id - success', () => {
    it('should return status(200) and object containing user data', (done) => {
        request(app)
        .patch(`/users/${userId}`)
        .set('token', token)
        .send({
            name: 'One Again',
            accounts: [{ name: 'BCA', instance: 'BCA', accountNumber: '111111' },
                        { name: 'OVO', instance: 'OVO', accountNumber: '222222' }],
            friendList: [{ userId: '5e7499e93c050e61249aeac7'}, { userId: '5e749f20ff201570c3629be0' }],
            image_url: ''
        })
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            expect(typeof res.body).toBe('object')
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name')
            expect(res.body).toHaveProperty('accounts')
            expect(res.body).toHaveProperty('friendList')
            expect(res.body).toHaveProperty('image_url')
            done()
        })
    })
})

describe('PATCH /users/:id/accounts - success', () => {
    it('should return status(200) and object containing accounts data added', (done) => {
        request(app)
        .patch(`/users/${userId}/accounts`)
        .set('token', token)
        .send({
            name: 'GOPAY',
            instance: 'GOJEK',
            accountNumber: '333333'
        })
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            expect(typeof res.body.succeeded).toBe('object')
            // expect(res.body.succeeded).toHaveProperty('_id')
            expect(res.body.succeeded).toHaveProperty('name')
            expect(res.body.succeeded).toHaveProperty('instance')
            expect(res.body.succeeded).toHaveProperty('accountNumber')
            done()
        })
    })
})

// describe('PATCH /users/:id/accounts/:accountId - success', () => {
//     it('should return status(200) and object containing accounts data deleted', (done) => {
//         request(app)
//         .patch(`/users/${userId}/accounts/${accountId}`)
//         .set('token', token)
//         .expect(200)
//         .end((err, res) => {
//             if(err) return done(err)
//             expect(typeof res.body).toBe('object')
//             expect(res.body).toHaveProperty('_id')
//             expect(res.body).toHaveProperty('name')
//             expect(res.body).toHaveProperty('instance')
//             expect(res.body).toHaveProperty('accountNumber')
//             done()
//         })
//     })
// })