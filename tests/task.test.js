const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOne, 
    userOneId, 
    userTwo, 
    userTwoId, 
    taskOne, 
    taskTwo, 
    taskThree, 
    setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch tasks of userOne', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should block userTwo from deleting userOne task', async() => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

// Task Test Ideas

test('Should not create task with invalid description', async() => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: ''
        })
        .expect(400)
})

test('Should not create task with invalid completed', async() => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: 'Task four',
            completed: '984951'
        })
        .expect(400)
})

test('Should not update task with invalid description', async() => {
    await request(app)
        .patch('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ''
        })
        .expect(500)

    const task = await Task.findById(taskOne._id)
    expect(task.description).not.toBeNull()
})

test('Should not update task with invalid completed', async() => {
    await request(app)
        .patch('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 'q21safhg'
        })
        .expect(500)

    const task = await Task.findById(taskOne._id)
    expect(task.completed).not.toEqual('q21safhg')
})

test('Should delete user task', async() => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
})

test('Should not delete task if unauthenticated', async() => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should not update other user\'s task', async() => {
    await request(app)
        .patch('/tasks/' + taskTwo._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: 'Something different'
        })
        .expect(404)

    const task = await Task.findById(taskTwo._id)
    expect(task.description).not.toEqual('Something different')
})

test('Should fetch user task by task id', async() => {
    await request(app)
        .get('/tasks/' + taskTwo._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not fetch user task by task id if unauthenticated', async() => {
    await request(app)
        .get('/tasks/' + taskTwo._id)
        .send()
        .expect(401)
})

test('Should not fetch other user\'s task by task id', async() => {
    await request(app)
        .get('/tasks/' + taskTwo._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
})

// test('Should fetch only completed tasks', async() => {
//     await request(app)
// })

//
// Task Test Ideas
//
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks