const request = require('supertest')
const app = require('../app')

let registerData = {
    name: 'One Direction',
    email: 'one@mail.com',
    username: 'one',
    password: 'onedirection',
    accounts: [{ name: 'BCA', instance: 'BCA', accountNumber: '111111' },
    { name: 'BCA', instance: 'BCA', accountNumber: '111111' }],
    friendList: [{ userId: '5e7499e93c050e61249aeac7'}, { userId: '5e749f20ff201570c3629be0' }]
}
let token