const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

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

const userTwoId = new mongoose.Types.ObjectId() // separate from userOne because it's used in different places
const userTwo = {
    _id: userTwoId,
    name: 'Herald',
    email: 'Herald@example.com',
    password: 'Heraldiscool247',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET) // Set up for authentication
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwo._id
}

// performs same function as beforeEach() in user.test.js
const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}