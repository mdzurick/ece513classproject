var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require("jwt-simple");
var SPFvalue = require("../models/spfvalues");
var User = require("../models/users");
var mongoose = require("mongoose");

// Secret key for JWT
//var secret = fs.readFileSync(__dirname + '/../../config-sunsmart/jwtkey').toString();

/* GET return SPF json object associated with the provided token */
router.get("/", function(req, res) {
    // Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
	return res.status(401).json({success: false, error: "Missing X-Auth header"});
    }

    // X-Auth should contain the token value
    var token = req.headers["x-auth"];

    // try decoding
    try {
	var decoded = jwt.decode(token, secret);

	// Find an SPF value based on decoded token
	User.findOne({ email: decoded.email }, function (err, user) {
	    if (err) {
		return res.status(500).json({success: false, error : err });
	    } else {
		if (!user) {
		    return res.status(400).json({success: false, error : "User not found" });
		} else {//User Found
		    // Find SPF based on decoded token
		    SPFvalue.find({userEmail: decoded.email }, function(err, spf) {
			if (err) {
			    res.status(500).json({success: false, error: err });
			} else if (spf === undefined || spf.length == 0) {
			    res.status(400).json({ success: false, error: "No SPF data available for user" });
			}
			else {
			    res.status(200).json({ success: true, SPF: spf });
			}
		    });
		}
	    }
	});
    } catch (ex) {
	res.status(401).json({ success: false, error: "Invalid JWT" });
    }
});


/*POST Add SPF data to database */
router.post("/", function(req, res, next) {
// Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
	return res.status(401).json({error: "Missing X-Auth header"});
    }

    // X-Auth should contain the token value
    var token = req.headers["x-auth"];

    // try decoding
    try {
	var decoded = jwt.decode(token, secret);

	//Add SPF value to db, associated with given user.
	if (!req.body.hasOwnProperty("strength") ) {
	    res.status(400).send({ error: "Object missing 'strength' property" });
	}

	var newSPFvalue = new SPFvalue({
	    userEmail: decoded.email,
	    strength: req.body.strength,
	    firstApplied: req.body.firstApplied
	});
	
	newSPFvalue.save(function(err, spf) {
	    if (err) {
		res.status(500).json({ success: false, error: err });
	    } else {
		res.status(201).json( {success: true, message: decoded.email + " has registered a new SPF value/"});
	    }
	});
	
    } catch (ex) {
	res.status(401).json({success: false, error: "Invalid JWT" });
    }
});


module.exports = router;
