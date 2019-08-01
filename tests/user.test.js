const request = require('supertest') // request is the name generally used in supertest conventions
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId() // separate from userOne because it's used in different places
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'mikeiscool247',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) // Set up for authentication
    }]
}

beforeEach(async() => {
    await User.deleteMany()
    await new User(userOne).save()
})

// afterEach(() => {
//     console.log('afterEach')
// })

test('Should sign up new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Chuck',
            email: '2020clink@example.net',
            password: 'qwerty'
        })
        .expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Chuck',
            email: '2020clink@example.net'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('qwerty')
})

test('Should login existing user', async() => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token) // can directly grab token from response because output sends JSON token field
})

test('Should not login nonexistent user', async() => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'chuck@blah.com',
            password: 'RedLeader'
        })
        .expect(400)
})

test('Should get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

// validate the user was deleted
//
// fetch the user from the database
// assert null response (use assesrtion from signup test)
// test your work

// // Assert that the database was changed correctly
// const user = await User.findById(response.body.user._id)
// expect(user).not.toBeNull()

test('Should not delete account for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})