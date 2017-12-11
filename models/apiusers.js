var db = require("../db");

var APIuser = db.model("APIuser", {
    email: { type: String, required: true, unique: true},
    apikey: { type : String, required: true, unique: true}
});

module.exports = APIuser;
