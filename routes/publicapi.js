var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require("request");
var SensorData = require("../models/sensordata");
var APIuser = require("../models/apiusers");
var reverse = require('reverse-geocode');

/* GET list of all sensor data 
router.get("/", function(req, res) {
    
   /* SensorData.find({},{'latitude':1, 'longitude': 1},function(err, sensordata) {
	if (err) {
	    res.status(400).send(err);
	} else {
	    //res.json(sensordata);
	   // reverse.lookup(37.8072792, -122.46167);
	}
}); */

   //SensorData.findById("5a11fcc85d206335246c1470", {'latitude':1, 'longitude':1},  function(err, sensordata) {
	//res.json(sensordata.latitude);
/*     SensorData.find({},{'latitude':1, 'longitude':1},function(err, sensordata){
	//var id = sensordata._id;
	var lat = sensordata.latitude;
	var lon = sensordata.longitude;
	var revgeocode = reverse.lookup(lat, lon);
	var zip = revgeocode.zipcode; 
	var city = revgeocode.city; 
	var state = revgeocode.state;
	console.log(sensordata); 
	//sensordata.zipcode = reverse.lookup(sensordata.latitude, sensordata.longitude); 
	//console.log("New zipcode:" 
}); 
}); */


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
