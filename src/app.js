require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

require("./db/connection");
const authentication = require("./authentication");
const User = require("./models/users");
const { reset } = require('nodemon');

let loggedUser;
let forgotpassEmail;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/index", function(req, res) {
    res.render("index");
})

app.get("/signup", function(req, res) {
    res.render("signup");
})

app.get("/user", authentication, function(req, res) {
    
    if(req.token == undefined) {
        res.render("index");
    } else {
        res.render("user", { user: loggedUser});
    }
})

app.get("/forgotpassword", function(req, res) {
    res.render("forgotpass");
})

app.get("/confirmSecurityQnA", function(req, res) {

    res.render("confirmSecurityQnA");
})

//logout
app.get("/logout", authentication, function(req, res) {
    try {

        if(req.token == undefined) {
            res.render("index");
        } else {
            res.clearCookie("jwt");
            
            res.render("index");
        }
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
        
        if(userCheck !== null) {

            const passCheck = await bcrypt.compare(password, userCheck.password);

            if(passCheck) {
                const token = await userCheck.generateAuthToken();

                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 300000),
                    httpOnly: true
                })

                loggedUser = userCheck.name;
                res.redirect("/user");
            } else {
                res.render("index", { validationMsg: "Invalid Login Credentials"});
            }

        } else {
            res.render("index", { validationMsg: "Invalid Login Credentials"});
        }

    } catch(err) {
        res.status(400).send(err);
    }
})

//forgot password logic
app.post("/forgotpassword", async (req, res) => {
    try {

        const email = req.body.email;

        const userCheck = await User.findOne({email: email});
        if(userCheck!==null) {
            
            forgotpassEmail = userCheck.email;
            res.redirect("/confirmSecurityQnA");
        } else {
            res.render("forgotpass", { validationMsg: "No such email exists"});
        }

    } catch(err) {
        res.status(400).send("No such Email exist");
    }
})

//security answer check
app.post("/confirmSecurityQnA", async (req, res) => {

    try {   

        const securityQ = req.body.securityQues;
        const securityA = req.body.securityAns;

        const checkEmail = await User.findOne({email: forgotpassEmail});

        if(checkEmail===null) {
            res.render("forgotpass");
        } else if(checkEmail.securityQues === securityQ && checkEmail.securityAns === securityA) {
            res.render("resetPassword");
        } else {
            res.render("confirmSecurityQnA", { validationMsg: "Security Verification Failed!" });
        }

    } catch(err) {
        res.status(400).send(err);
    }
})

app.post("/resetPassword", async (req, res) => {
    try {

        if(forgotpassEmail===null) {
            res.render("index", { validationMsg: "You can only reset your password once!"});
        } else {
            const resetPass = await bcrypt.hash(req.body.password, 10);
            const newPass = await User.updateOne({password: resetPass});
            forgotpassEmail = null;
            res.render("resetPassword", { confirmationMsg: "Password changed Successfully!"});
        }
        
    } catch(err) {
        res.status(400).send(err);
    }
})

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})