// // CRUD create read update delete

// // const mongodb = require('mongodb')
// // const MongoClient = mongodb.MongoClient
// // const ObjectID = mongodb.ObjectID

// const { MongoClient, ObjectID} = require('mongodb')

// const connectionURL = 'mongodb://127.0.0.1:27017' // using localhost:27017 would slow down the program
// const databaseName = 'task-manager'

// // const id = new ObjectID()
// // console.log(id.id.length)
// // console.log(id.toHexString().length)

// MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to database.')
//     }

//     const db = client.db(databaseName)

// // insert
//     // db.collection('users').insertOne({
//     //     _id: id,
//     //     name: 'Charles',
//     //     age: 18
//     // }, (error, result) => {
//     //     if (error) {
//     //         return console.log('Unable to insert user')
//     //     }

//     //     console.log(result.ops)
//     // })
    

//     // db.collection('users').insertMany([{
//     //     name: 'John',
//     //     age: 17
//     //     } , {
//     //     name: 'Henry',
//     //     age: 15
//     //     }   
//     // ], (error, result) => {
//     //     if (error) {
//     //         return console.log('Unable to insert documents.')
//     //     }

//     //     console.log(result.ops)
//     // })

//     // db.collection('tasks').insertMany([{
//     //     description: 'Take out the trash',
//     //     completed: false
//     // }, {
//     //     description: 'Feed the dog',
//     //     completed: false
//     // }, {
//     //     description: 'Run',
//     //     completed: true
//     // }], (error, result) => {
//     //     if (error) {
//     //         return console.log('Unable to insert tasks.')
//     //     }

//     //     console.log(result.ops)
//     // })



// // find
//     // db.collection('users').findOne({ _id: new ObjectID('5d2781740aecc45168d5b814')} , (error, user) => {
//     //     if (error){
//     //         return console.log('Unable to fetch thing')
//     //     }

//     //     console.log(user)
//     // })

//     // db.collection('users').find({ age: 18 }).toArray((error, users) => {
//     //     if (error){
//     //         return console.log('Unable to fetch the thing')
//     //     }

//     //     console.log(users)
//     // })

//     // db.collection('tasks').findOne({ _id: new ObjectID("5d26629f26bf52071cf5e949")}, (error, task) => {
//     //     console.log(task)
//     // })
//     // db.collection('tasks').find({ completed: false}).toArray((error, tasks) => {
//     //     console.log(tasks)
//     // })


// // update
//     // db.collection('users').updateOne({ 
//     //     _id: new ObjectID('5d2781740aecc45168d5b814')
//     // },{ 
//     //     $set: {
//     //         name: 'Matt'
//     //     }
//     // }).then((result) => {
//     //     console.log(result)
//     // }).catch((error) => {
//     //     console.log(error)
//     // })

//     // db.collection('tasks').updateMany({ 
//     //     completed: false
//     // },{ 
//     //     $set: { completed: true }
//     // }).then((result) => { console.log(result)
//     // }).catch((error) => { console.log(error)
//     // })



// // delete
//     db.collection('users').deleteMany({
//         age: 18
//     }).then((result) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })

//     db.collection('tasks').deleteOne({
//         completed: true
//     }).then((result) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })
// })