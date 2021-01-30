const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

module.exports = function () {
    const db = "mongodb://localhost:27017/forum_app";

    mongoose.connect(db, {useUnifiedTopology:true ,useNewUrlParser: true}).then(() => console.log("Connected to db...")).catch(() => console.log("Failed to connect to db..."));
}