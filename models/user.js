const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    rollNumber: {
        type: Number,
        required: true
    },
    companyName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)