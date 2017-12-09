var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require("jwt-simple");
//var Device =  require("../models/device");
var User = require("../models/users");
var bcrypt = require("bcrypt-nodejs");

// Secret key for JWT
var secret = fs.readFileSync(__dirname + '/../../jwtkey').toString();

/* POST Authenticate user sign-in */
router.post("/signin", function(req, res, next) {

    User.findOne( {email: req.body.email}, function(err, user) {
	if (err) {
	    res.status(401).json({error: "Database Error"});
	} else if (!user) {
	    res.status(401).json({error: "User does not exist"});//TODO: Too detailed, change to bad user/password after debugging
	} else {//Check user post hash against stored password hash for user email
	    bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {

		if (err) {
		    res.status(401).json({error: "bcrypt failed"});
		} else if (valid) {//Match. Generate authentication token.
		    var token = jwt.encode({email: req.body.email}, secret);
		    res.status(201).json({token: token, fullName: user.fullName}); //TODO: add appropriate redirect.
		} else {
		    res.status(401).json({error: "Incorrect Password"}); //TODO: be more vague, i.e. bad user/password after debugging
		}
	    });
	}
    });
});


/*POST register a new user */
router.post("/register", function(req, res, next) {
    //Create a hash for the submitted password
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
	var newUser = new User({
	    email: req.body.email,
	    fullName: req.body.fullName,
	    passwordHash: hash
	});

	newUser.save(function(err, user) {
	    if (err) {
		res.status(403).send({success: false, message: err.errmsg});
	    } else {
		res.status(201).json({success: true, message: user.fullName + " has successfully created an account.", redirect: "/signin.html"});
	    }
	});
    })
});


/*GET user status */
router.get("/status", function(req, res) {
    //Check if the X-Auth is set
    if (!req.headers["x-auth"]) {
	return res.status(401).json({error: "No X-Auth Header"});
    }

    //X-Auth must contain token value
    var token = req.headers["x-auth"];

    //Decode and verify token
    try {

	var decoded = jwt.decode(token, secret);
	var userStatus = {};

	//Find a user from decoded token
	User.findOne({email: decoded.email}, function(err, user) {
	    if (err) {
		return res.status(401).json({error: "Database Error"});
	    } else {
		if(!user) {
		    return res.json({error: "User Not Found"});
		} else {
		    userStatus['email'] = user.email;
		    userStatus['fullName'] = user.fullName;
		    userStatus['lastAccess'] = user.lastAccess;
//		    userStatus['redirect'] = "/home.html";

		    // Find devices based on decoded token
//		    Device.find({ userEmail : decoded.email}, function(err, devices) {
//			if (err) {
//			    res.status(401).json({error: "Database Error"});
//			} else {
//			    // Construct device list
//			    var deviceList = [];
//			    for (device of devices) {
//				deviceList.push({
//				    deviceId: device.deviceId,
//				    apikey: device.apikey,
//				});
//			    }
//			    userStatus['devices'] = deviceList;
//			    res.json(userStatus);
//			}
//		    });
		    res.json(userStatus);
		}
	    }
	});
    } catch (ex) {
	res.status(401).json({ error: "Invalid JWT" });
    }
});


module.exports = router;
