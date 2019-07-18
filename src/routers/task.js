const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body) 

    try {
        await task.save()
        res.status(201).send(task)
    } catch(error) {
        res.status(400).send()
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400).send(error.message)
    // })
})

router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(error) {
        res.status(500).send()
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }

    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.patch('/tasks/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    const _id = req.params.id

    if (!isValidOperation){
        return res.status(400).send({error: 'Invalid Fields'})
    }

    try {
        const task = await Task.findById(_id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        // const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', async(req, res) => {
    try {
        // finds whatever id has been requested and deletes it
        const task = await Task.findByIdAndDelete(req.params.id) 

        if (!task){ // if there was no task linked to the id, there will be a 404 error
            return res.status(404).send()
        }
        res.send(task) // sends deleted task details 
    } catch(error) {
        res.status(500).send() // error for something on my end
    }
})

module.exports = router