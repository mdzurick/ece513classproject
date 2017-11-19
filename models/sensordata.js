var db = require("../db");

// Create a model from the schema
var SensorData = db.model("SensorData", {
    apikey: String,
    deviceId: String,
    submitTime: { type: Date, default: Date.now },
    latitude: Number,
    longitude: Number,
    altitude: Number,
    UV: Number,
    measuredTime: Number
});

module.exports = SensorData;
