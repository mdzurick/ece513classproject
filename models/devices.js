var db = require("../db");

// Create a model from the schema
var Device = db.model("Device", {
    apikey:       String,
    deviceId:     String,
    userEmail:    String,
    lastContact:  { type: Date, default: Date.now }
});

module.exports = Device; 
