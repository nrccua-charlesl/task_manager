const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/test', (req, res) => {
    res.send('from a new file')
})

router.post('/users', async (request, response) => {
    const user = new User(request.body) // gets info being sent to the database

    try {
        await user.save()
        const token = await user.generateAuthToken()
        response.status(201).send({user, token}) // responds with a 201 status and new user details
    } catch(e) {
        response.status(400).send(e.message)
    }

    // user.save().then(() => {
    //     response.status(201).send(user)
    // }).catch((error) => {
    //     // sets status to 400 (bad request) and sends the error message
    //     response.status(400).send(error.message) 
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch(error) {
        res.status(400).send(error.message)
    }
})

router.post('/users/logout', auth, async(req,res) =>{
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async( req, res ) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

router.get('/users/all/:pw', async (req, res) => {
    try {
        if (req.params.pw != 'RedLeader') {
            throw new Error()
        }
        const users = await User.find({}) // finds users, doesn't define any limits on search so everything is returned
        res.send(users) // sends all users information
    } catch(error) {
        res.status(500).send() // error handling
    }

    // User.find({}).then((users) => {
    //     response.send(users)
    // }).catch((error) => {
    //     response.status(500).send()
    // })
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id // sets inputted id as _id

    try {
        const user = await User.findById(_id) // finds the user with the specific id
        if (!user){
            return res.status(404).send() // if no user has that id then 404 is returned (has to be of same length as normal id)
        }
        res.status(201).send(user) // returns user
    } catch (error) {
        res.status(400).send() // error handling
    }

    // User.findById(_id).then((user) => {
    //     if (!user){
    //         return res.status(404).send()
    //     }

    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
    // console.log(req.params)
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body) // grabs inputted body for validation
    const allowedUpdates = ['name', 'email', 'password', 'age'] // list of parameters allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // checks each update object to see if any have don't include valid parameters

    if (!isValidOperation){
        return res.status(400).send({error: 'Invalid Fields'}) // error handling for invalid fields
    }

    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) // finds user and updates using update objects

        if (!user) {
            return res.status(404).send() // error handling, user not found
        }
        res.send(user) // returns the updated user
    } catch (error){ 
        res.status(400).send(error) // error handling
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id) // finds user using id and deletes it

        if(!user) {
            return res.status(404).send() // error handling: user not found
        }
        res.send(user) // details of deleted user
    } catch (error) {
        res.status(500).send() // error handling
    }
})

module.exports = router