var express = require('express');
var router = express.Router();
var SensorData = require("../models/sensordata");
var Device = require("../models/devices");

/* GET list of all sensor data */
router.get("/testresults", function(req, res) {
    
    SensorData.find(function(err, sensordata) {
	if (err) {
	    res.status(400).send(err);
	} else {
	    res.json(sensordata);
	}
    });
});
    
/* POST sensor data*/
router.post('/', function(req, res) {

var parseBody = new Object();

    parseBody.apikey = req.body.apikey;
    parseBody.deviceId = req.body.deviceId;
    parseBody.submitTime = req.body.submitTime;
    parseBody.latitude = req.body.latitude;
    parseBody.longitude = req.body.longitude;
    parseBody.altitude = req.body.altitude;
    parseBody.UV = req.body.UV;
    parseBody.measuredTime = req.body.measuredTime;

    for (var property in parseBody) {
	if (parseBody.hasOwnProperty(property)) {
	    if (parseBody[property] == null ) {
		return res.status(400).send("\"" + property + "\"" + " is null/undefined");
	    }
	}
    }

    Device.findOne({ deviceId: parseBody.deviceId }, function(err, device) {

	if (err) {
	    res.status(500).json({ error: err });
	} else if (!device) {
	    res.status(400).json({ error: "Device ID not found"});
	} else {

	    if (device.apikey === parseBody.apikey) {//Correct apikey, add data to db
		var sensordata = new SensorData(parseBody);
		sensordata.save(function(err, sensordata) {
		    if (err) {
			res.status(500).send({ error: err });
		    } else {
			res.status(201).json(sensordata);
		    }
		});
	    } else {
		res.status(400).json({ error: "Invalid API Key" });
	    }
	}
    });
});

module.exports = router;
