var express = require('express');
var router = express.Router();
var SensorData = require("../models/sensordata");
var reverse = require('reverse-geocode');

/* GET list of all sensor data */
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
}); */
});


router.get('/zip/:zipcode', function(req, res, next){
	var zip = req.params.zipcode; 
	console.log(zip);

	var query = {"zipcode": zip}; 

	SensorData.find(query, function(err, sensordata){
	   if(err){
		var errormsg = {"message":err};
		res.status(400).send(JSON.stringify(errormsg));
}
	   else{
		var responseJson = { UV: []};
		for (var doc of sensordata){
			res.json(responseJson);
		}
	   }
	});

});

module.exports = router;
