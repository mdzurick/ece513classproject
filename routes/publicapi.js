var express = require('express');
var router = express.Router();
var SensorData = require("../models/sensordata");
var APIuser = require("../models/apiusers");
var reverse = require('reverse-geocode');

router.get("/", function(req, res){
    var userapi = req.query.key;
    var zipCode = req.query.zip;
    var city = req.query.city;
    var state = req.query.state;

    if (userapi == "null") {
	responseJson.status = "ERROR";
	responseJson.message = "Request missing APIKey."
	res.status(201).send(JSON.stringify(responseJson));
    }
    else{
	APIuser.findOne({"apikey": userapi}, function(err, keys){
	    if(keys !== null){
		if (zipCode !== null){
		    SensorData.find({"zipcode": zipCode}, function(err, sensordata){
			if(err){
			    var errormsg = {"message":err};
			    res.status(400).send(JSON.stringify(errormsg));
			}
			else {
			    res.json(sensordata);
			}
		    });
		}
		else if (city != null){
		    SensorData.find({"city": city}, function(err, citydata){
			if(err){
			    var errormsg2 = {"message":err};
			    res.status(400).send(JSON.stringify(errormsg));
			}
			else{
			    res.json(citydata);
			}
		    });
		}
	    }
	});
    }
});

module.exports = router;
