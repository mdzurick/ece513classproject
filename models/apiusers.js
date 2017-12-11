var db = require("../db");

var apiusers = new db.model("apiusers", {
    email: { type: String, required: true, unique: true},
    apikey: String
});

module.exports = apiusers;
