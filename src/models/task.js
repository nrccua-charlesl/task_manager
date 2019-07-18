const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = Task

// const run = new Task({
//     description: '           Drink water    ',
//     completed: true
// })

// run.save().then(() => {
//     console.log(run)
// }).catch((error) => {
//     console.log('Error! ', error)
// })