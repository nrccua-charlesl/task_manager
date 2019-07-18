require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5d2c87c78d3abd4efc792037').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })


const deleteTaskAndCount = async(id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}
deleteTaskAndCount('5d28a8fd3668161db0a4d22c').then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})


// const updateAgeAndCount = async(id, age) => {
//     const user = await User.findByIdAndUpdate(id, {age})
//     const count = await User.countDocuments({age})
//     return count
// }

// updateAgeAndCount('5d28a667b30d964d3ca4e79b', 2).then((count) => {
//     console.log(count)
// }).catch((error) => {
//     console.log(error)
// })