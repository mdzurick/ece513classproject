var db = require("../db");

// Create a model from the schema
var User = db.model("User", {
    email:        { type: String, required: true, unique: true },
    fullName:     { type: String, required: true },
    passwordHash: String,
    lastAccess:   { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false }
});

module.exports = User; 
