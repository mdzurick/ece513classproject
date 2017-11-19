var express = require('express');
var router = express.Router();
var SensorData = require("../models/sensordata");

/* GET list of all sensor data */
router.get("/", function(req, res) {

    //Delets all stored readings
//    SensorData.remove({}, function(err) {
//	console.log("Removed");
//    });

    
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
    parseBody.submitTime = req.body.time;
    parseBody.latitude = req.body.GPS.location.latitude;
    parseBody.longitude = req.body.GPS.location.longitude;
    parseBody.altitude = req.body.GPS.altitude;
    parseBody.UV = req.body.UV;
    parseBody.measuredTime = req.body.date;
    
    var sensordata = new SensorData(parseBody);
    sensordata.save(function(err, sensordata) {
	if (err) {
	    res.status(400).send(err);
	} else {
	    res.status(201).json(sensordata);
	}
    });
});

module.exports = router;
