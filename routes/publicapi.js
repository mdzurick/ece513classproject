var express = require('express');
var router = express.Router();
var SensorData = require("../models/sensordata");
var APIuser = require("../models/apiusers");
var fs = require('fs');
var nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

//Gmail
var gmailPass = fs.readFileSync(__dirname + '/../../config-sunsmart/gmail-key').toString();

// Function to generate a random apikey consisting of 32 characters
function getNewApikey() {
    var newApikey = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++) {
	newApikey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return newApikey;
}



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

router.post("/", function(req, res, next) {

    //Validating post body
    req.check('email', 'Email is not valid').isEmail();
    req.check('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var newAPIkey = getNewApikey();

    var newAPIuser  = new APIuser({
	email: req.body.email,
	apikey: newAPIkey
    });
    
    newAPIuser.save(function(err, apiuser) {
	if (err) {
	    res.status(500).json({error: err});
	}
	else {
	    //Send API key by email
	    var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
		    user: "sunsmartalmm@gmail.com",
		    pass: gmailPass
		}
	    });

	    var htmlSend = '<p>Hello,<br><br>API Key:</p><p>' + newAPIkey + '</p>';

	    var mailOptions = {
		from: '"SunSmart" <no-reply@SunSmart.com>',
		to: apiuser.email,
		subject: 'Your API Key',
		html: htmlSend };


	    transporter.sendMail(mailOptions, function (err) {
		if (err) {
		    APIuser.findOneAndRemove({ email: { $eq: apiuser.email }}, function(err, user) {
			console.log(apiuser.email + " removed from db");
		    });
		    return res.status(500).send({error: err.message});
		}
		//API Key successully generated for public users
		res.status(201).send({success: true, message: apiuser.email + " has successfully generated an API Key. An email with the key has been sent", redirect: "/signin.html"})
	    });
	}
    });
});

module.exports = router;
