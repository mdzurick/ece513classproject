var express = require('express');
var router = express.Router();
var Device = require("../models/devices");
var fs = require('fs');
var jwt = require("jwt-simple");

// Secret key for JWT
var secret = fs.readFileSync(__dirname + '/../../jwtkey').toString();

// Function to generate a random apikey consisting of 32 characters
function getNewApikey() {
    var newApikey = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++) {
	newApikey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return newApikey;
}

/*
// GET request return one or "all" devices registered and last time of contact.
router.get('/status/:devid', function(req, res, next) {
    var deviceId = req.params.devid;

    // Create query based on parameters deviceId
    if (deviceId == "all") {
	var query = {};
    }
    else {
	var query = { "deviceId": deviceId };
    }

    // Query the devices collection to returned requested documents
    Device.find(query, function(err, allDevices) {
	if (err) {
	    var errormsg = {"message": err};
	    res.status(400).send(JSON.stringify(errormsg));
	}
	else {
	    // Create JSON response consisting of an array of devices
	    var responseJson = { devices: [] };
	    for (var doc of allDevices) {
		// For each found device add a new element to the array
		// with the device id and last contact time
		responseJson.devices.push({ "deviceId": doc.deviceId, "lastContact": doc.lastContact});
	    }
	    res.status(200).send(JSON.stringify(responseJson));
	}
    });
});
*/


// POST registers a new device given the device ID and user email
router.post('/register', function(req, res, next) {
    var responseJson = {
	registered: false,
	message : "",
	apikey : "none"
    };

    var deviceExists = false;

    // Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
	responseJson.message = "Missing X-Auth header."
	return res.status(401).json(respnseJson);
    }
    // X-Auth should contain the token value
    var token = req.headers["x-auth"];

    // try decoding
    try {
	var decoded = jwt.decode(token, secret);

	// Ensure the request includes both the deviceId and email parameters
	if (!req.body.hasOwnProperty("deviceId")) {
	    responseJson.message = "Missing deviceId.";
	    res.status(400).json(responseJson);
	    return;
	}

	// See if device is already registered
	Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
	    if (device !== null) {
		responseJson.message = "Device ID " + req.body.deviceId + " already registered.";
		res.status(400).json(responseJson);
	    }
	    else {
		// Get a new apikey
		deviceApikey = getNewApikey();
		// Create a new device with specified id, user email, and randomly generated apikey.
		var newDevice = new Device({
		    deviceId: req.body.deviceId,
		    userEmail: decoded.email,
		    apikey: deviceApikey
		});

		// Save device. If successful, return success. If not, return error message.
		newDevice.save(function(err, newDevice) {
		    if (err) {
			console.log("Error: " + err);
			responseJson.message = err;
			res.status(400).json(responseJson);
		    }
		    else {
			responseJson.registered = true;
			responseJson.apikey = deviceApikey;
			responseJson.message = "Device ID " + req.body.deviceId + " successfully registered.";
			res.status(201).json(responseJson);
		    }
		});
	    }
	});
    } catch (ex) {
	responseJson.message = "Authentication error";
	res.status(401).json(responseJson);
    }
});

module.exports = router;

