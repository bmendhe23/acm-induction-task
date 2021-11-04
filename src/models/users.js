const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

//hashing is happening here before getting stored in the database
userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
})

const User = new mongoose.model('User', userSchema);

module.exports = User;

