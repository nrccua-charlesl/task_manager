const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a picture'))
        }

        cb(undefined, true)
    }
})

router.get('/test', (req, res) => {
    res.send('from a new file')
})

router.post('/users', async (request, response) => {
    const user = new User(request.body) // gets info being sent to the database

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        response.status(201).send({user, token}) // responds with a 201 status and new user details
    } catch(e) {
        response.status(400).send(e.message)
    }
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

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()

    req.user.avatar = buffer  
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
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
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        if (!user || !user.avatar){
            throw new Error()
        }
        
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch(error) {
        res.status(404).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body) // grabs inputted body for validation
    const allowedUpdates = ['name', 'email', 'password', 'age'] // list of parameters allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // checks each update object to see if any have don't include valid parameters

    if (!isValidOperation){
        return res.status(400).send({error: 'Invalid Fields'}) // error handling for invalid fields
    }

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        res.send(user) // returns the updated user
    } catch (error){ 
        res.status(400).send(error) // error handling
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()    
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user) // details of deleted user
    } catch (error) {
        res.status(500).send() // error handling
    }
})

module.exports = router