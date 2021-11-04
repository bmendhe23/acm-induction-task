const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/"+process.env.DB_NAME, { useNewUrlParser: true})
.then( () => {
    console.log("Database Connection Established");
})
.catch((err) => {
    console.log(err);
});