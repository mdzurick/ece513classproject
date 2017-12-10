var db = require("../db");

// Create a model from the schema
var SPFvalue = db.model("SPFvalue", {
    userEmail: {type: String, required: true, unique: true},
    strength: Number,
    firstApplied: { type: Date, default: Date.now }
});

module.exports = SPFvalue;
