const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

//     // Middleware function
// app.use((req, res, next) => {
//     if (req.method == 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

//     // Middleware function
// app.use((req, res, next) => {
//     res.status(503).send('Site is under maintenance, please come again later.')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//
// Without middleware:  new request -> run route handler
//
// With middleware:     new request -> do something -> run route handler
//

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload a picture'))
//         }

//         // cb(new Error('File must be a PDF'))
//         cb(undefined, true)
//         // cb(undefined, false)
//     }
// })
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

// content from ./routers/user used to be held here
// content from ./routers/task used to be held here


app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})

// const jwt = require('jsonwebtoken')

// // const pet = {
// //     name: 'Hal'
// // }

// // pet.toJSON = function() {
// //     return {}
// // }

// // console.log(JSON.stringify(pet))

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async() => {
//     // const task = await Task.findById('5d39fe1bdc0ddb2558db9f3a')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById('5d39cb05b550401898750c4e')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()

// // myFunction not called when not needed
// const myFunction = async () => {
//     // jwt.sign(public info, password, customization parameters) // creates token 
//     const token = await jwt.sign({ _id: 'abc123' }, 'yeetusmaximus', { expiresIn: '1 second' })
//     console.log(token)

//     const data = jwt.verify(token, 'yeetusmaximus') // verifies 1st parameter using the 2nd parameter secret (password)
//     console.log(data)


//     // following code used bcrypt instead of jsonwebtoken
//         // const password = 'Red12345'
//         // const hashedPassword = await bcrypt.hash(password, 8)

//         // console.log(password)
//         // console.log(hashedPassword)

//         // const isMatch = await bcrypt.compare('Red12345', hashedPassword)
//         // console.log(isMatch)
// }

// // myFunction()