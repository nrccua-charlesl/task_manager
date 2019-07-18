const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        console.log(token)
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.'})
    }
}

module.exports = auth