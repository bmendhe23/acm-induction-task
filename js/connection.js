const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/regisUsers", { useNewUrlParser: true })
.then( () => console.log("Connection Successful"))
.catch((err) => console.log(err));

// User Schema
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
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

//Model
const User = new mongoose.model("User", userSchema);

//create document

const createDocument = async () => {
    try {
        const user1 = new User({
            email: "bhushanmendhe15@gmail.com",
            username: "bmendhe23",
            name: "Bhushan Mendhe",
            password: "12345",
            securityQues: "Which city were you born in?",
            securityAns: "Jammu"
        });
    
        const result = await user1.save();
        console.log(result);
    } catch(err) {
        console.log(err);
    }
    
}

// createDocument();

//read document

const getDocument = async () => {
    const result = await User.find();
    console.log(result);
}

getDocument();