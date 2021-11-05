require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

require("./db/connection");
const authentication = require("./authentication");
const User = require("./models/users");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");

app.use(express.static(static_path));

app.get("/index", function(req, res) {
    const index_path = path.join(__dirname, "../public/index.html");
    res.sendFile(index_path);
})

app.get("/user", authentication, function(req, res) {
    const user_path = path.join(__dirname, "../public/user.html");
    res.sendFile(user_path);
})

app.get("/logout", authentication, function(req, res) {
    try {

        req.user.tokens = req.user.tokens.filter((element) => {
            return element.token !== req.token;
        })

        res.clearCookie("jwt");
        
        const index_path = path.join(__dirname, "../public/index.html");
        res.sendFile(index_path);
    } catch(err) {
        res.status(500).send(err);
    }
})

//post request to create user
app.post("/signup", async (req, res) => {
    try {
        const registerUser = new User({
            ...req.body
        })

        const token = await registerUser.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        });

        const registeredUser = await registerUser.save();
        res.status(201).redirect("/index");

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
        const passCheck = await bcrypt.compare(password, userCheck.password);

        const token = await userCheck.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true
        })
        
        if(passCheck) {
            res.redirect("/user");
        } else {
            res.send("Invalid Login Details");
        }

    } catch(err) {
        res.status(400).send(err);
    }
})

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})