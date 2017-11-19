var db = require("../db");

// Create a model from the schema
var SensorData = db.model("SensorData", {
    apikey: String,
    deviceId: String,
    submitTime: { type: Date, default: Date.now },
    latitude: Number,
    longitude: Number,
    alititude: Number,
    UV: Number,
    date: Date
});

module.exports = SensorData;
