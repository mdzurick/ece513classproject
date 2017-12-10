var db = require("../db");
var mongoose = require("mongoose");

// Create a model from the schema
var Token = db.model("Token", {
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: {type: Date, required: true, default: Date.now, expires: 86400 }
});

module.exports = Token; 
