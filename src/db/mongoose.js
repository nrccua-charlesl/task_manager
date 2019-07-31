//  /Users/charles.link/mongoDB/bin/mongod.exe --dbpath=/Users/charles.link/mongoDB-data

const mongoose = require("mongoose")
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
})