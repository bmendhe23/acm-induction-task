const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    securityQues: {
        type: String,
        required: true
    },
    securityAns: {
        type: String,
        required: true
    }
})

const User = new mongoose.model('User', userSchema);

module.exports = User;