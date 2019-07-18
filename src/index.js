const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

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


// content from ./routers/user used to be held here
// content from ./routers/task used to be held here


app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})

const jwt = require('jsonwebtoken')

const myFunction = async () => {
    // jwt.sign(public info, password, customization parameters) // creates token 
    const token = await jwt.sign({ _id: 'abc123' }, 'blahblahtesttest', { expiresIn: '1 second' })
    console.log(token)

    const data = jwt.verify(token, 'blahblahtesttest') // verifies 1st parameter using the 2nd parameter secret (password)
    console.log(data)


// following code used bcrypt instead of jsonwebtoken
    // const password = 'Red12345'
    // const hashedPassword = await bcrypt.hash(password, 8)

    // console.log(password)
    // console.log(hashedPassword)

    // const isMatch = await bcrypt.compare('Red12345', hashedPassword)
    // console.log(isMatch)
}

// myFunction()