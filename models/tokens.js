var db = require("../db");

// Create a model from the schema
var Token = db.model("Token", {
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: {type: Data, required: true, defualt: Date.now, expires: 86400 }

});

module.exports = User; 
