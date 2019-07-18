//  /Users/charles.link/mongoDB/bin/mongod.exe --dbpath=/Users/charles.link/mongoDB-data

const mongoose = require("mongoose")
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})