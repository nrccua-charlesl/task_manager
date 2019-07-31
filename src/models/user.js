const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.')
            }
        }
    },  
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 6){
                throw new Error('Password must be greater than 6 characters long')
            }
            if (value.toLowerCase().includes('password')){ // will be true even if Password doesn't just have password in it
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{ // could ask for type of device you are using (whether direct or indirect) to better clarify which devices are logged in
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })    
    
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })

    if (!user){
        throw new Error('Invalid Credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Invalid Credentials')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User


// const me = new User({
//     name: 'Henry  ',
//     email: 'Henrich@gamil.com   ',
//     password: 'password123'
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error! ', error)
// })