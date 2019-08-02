const request = require('supertest') // request is the name generally used in supertest conventions
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, userOneId, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

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

test('Should not delete account for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer)) // objects aren't equal even with the same properties because they are still distinct from one another
})

// test user updates
//
// create "should update valid user fields"
//  - update the name of the test user
//  - check the data to confirm it's changed
// create "should not update invalid user fields"
//  - update a location" filed and expect error status code
// test work

test('Should update valid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'New Mike'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).not.toEqual(userOne.name)
})

test('Should not update invalid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            tokens: { token: 'awegawhpaphabaerph' } // tokens should not be malleable
        })
        .expect(400)

    const user = await User.findById(userOneId)
    expect(user.tokens[0].token).toEqual(userOne.tokens[0].token)
})

test('Should not signup user with invalid name', async() => {
    await request(app)
        .post('/users')
        .send({
            name: '',
            email: 'yeetus@example.net',
            password: 'testpw'
        })
        .expect(400)
})

test('Should not signup user with invalid email', async() => {
    await request(app)
        .post('/users')
        .send({
            name: 'gerald',
            email: 'le.net',
            password: 'testpw'
        })
        .expect(400)
})

test('Should not signup user with invalid password', async() => {
    await request(app)
        .post('/users')
        .send({
            name: 'gerald',
            email: 'yeetus@example.net',
            password: 'password'
        })
        .expect(400)
})

test('Should not update user if unauthenticated', async() => {
    await request(app)
        .patch('/users/me')
        .send({ 
            name: 'michael'
        })
        .expect(401)
})

test('Should not update invalid name', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: ''
        })
        .expect(400)

    const user = await User.findById(userOneId)
    expect(user.tokens[0].token).toEqual(userOne.tokens[0].token)
})

test('Should not update invalid email', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'yeetus.gaba'
        })
        .expect(400)

    const user = await User.findById(userOneId)
    expect(user.tokens[0].token).toEqual(userOne.tokens[0].token)
})

test('Should not update invalid password', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: 'password'
        })
        .expect(400)

    const user = await User.findById(userOneId)
    expect(user.tokens[0].token).toEqual(userOne.tokens[0].token)
})

test('Should not delete user if unauthenticated', async() => {
    await request(app)
        .patch('/users/me')
        .send()
        .expect(401) // auth catches error before 500 error is caught
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated