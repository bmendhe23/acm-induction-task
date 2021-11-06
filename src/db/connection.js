const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true})
.then( () => {
    console.log("Database Connection Established");
})
.catch((err) => {
    console.log(err);
});
