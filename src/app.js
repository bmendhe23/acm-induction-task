const express = require("express");
const path = require("path");
const app = express();

require("./db/connection");
const User = require("./models/users");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../");

app.use(express.static(static_path));

//post request to create user
app.post("/signup", async (req, res) => {
    try {
        const registerUser = new User({
            ...req.body
        })

        const registeredUser = await registerUser.save();
        res.status(201).send("User Registered");

    } catch(err) {
        res.status(400).send(err);
    }
})

//login checking 
app.post("/index", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userCheck = await User.findOne({email: email});
        res.send(userCheck.password);
        console.log(userCheck.password);
    } catch(err) {
        res.status(400).send("Invalid Email");
    }
})

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})