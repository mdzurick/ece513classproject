var db = require("../db");

// Create a model from the schema
var Device = db.model("Device", {
    apikey:       {type: String, required: true, unique: true},
    deviceId:     {type: String, required: true, unique: true},
    userEmail:    String,
    lastContact:  { type: Date, default: Date.now }
});

module.exports = Device; 
