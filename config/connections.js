const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/socialnetwork-api");

module.exports = mongoose.connection;
