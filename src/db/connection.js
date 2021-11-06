const mongoose = require("mongoose");

mongoose.connect("https://acm-ind-task.herokuapp.com/"+process.env.DB_NAME, { useNewUrlParser: true})
.then( () => {
    console.log("Database Connection Established");
})
.catch((err) => {
    console.log(err);
});
