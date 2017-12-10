var db = require("../db");

// Create a model from the schema
var SPFvalue = db.model("SPFvalue", {
    userEmail: { type: String, required: true },
    strength: { type: Number, required: true },
    firstApplied: { type: Date, default: Date.now }
});

module.exports = SPFvalue;
