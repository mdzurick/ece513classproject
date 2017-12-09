var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require("jwt-simple");
var Device =  require("../models/devices");
var Token =  require("../models/tokens");
var User = require("../models/users");
var bcrypt = require("bcrypt-nodejs");
var crypto = require('crypto');
var nodemailer = require('nodemailer');

// Secret key for JWT
var secret = fs.readFileSync(__dirname + '/../../jwtkey').toString();

/* POST Authenticate user sign-in */
router.post("/signin", function(req, res, next) {
    //Validating post body
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
    
    User.findOne( {email: req.body.email}, function(err, user) {
	if (err) {
	    res.status(401).json({error: "Database Error"});
	} else if (!user) {
	    res.status(401).json({error: "User does not exist"});//TODO: Too detailed, change to bad user/password after debugging
	} else {//Check user post hash against stored password hash for user email
	    bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {

		if (err) {
		    res.status(401).json({error: "bcrypt failed"});
		} else if (valid) {//Match. Generate authentication token if user is verified.

		    //First check if user is verified, exiting function if the user hasn't yet verified
		    if(!user.isVerified)  return res.status(401).send({ error: "User account has not been verified." });

		    //Successful login, generate authentication token and send to user
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
    //Validating post body
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password must be at least 10 characters long').len(10);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
    
    //Create a hash for the submitted password
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
	var newUser = new User({
	    email: req.body.email,
	    fullName: req.body.fullName,
	    passwordHash: hash
	});

	newUser.save(function(err, user) {
	    if (err) {
		res.status(403).send({success: false, message: err.message});
	    } else {

		//Create account verificiation token for user
		var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

		//Save verfication token
		token.save(function(err, token) {
		    if (err) {
			return res.status(500).send({error: err.message)};
		    } else {

			//Confirmation Email
			var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
			var mailOptions = { from: 'no-reply@SunSmart.com', to: user.email, subject: 'Confirm Your SunSmart Account',text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirm\/' + token.token + '.\n' };
			transporter.sendMail(mailOptions, function (err) {
			    if (err) {
				return res.status(500).send({error: err.message});
			    }
			    res.status(201).send({success: true, message: user.fullName + " has successfully created an account. A verification email has been sent to " + user.email + "." , redirect: "/signin.html"})
			});
		    }
		});
		
//		res.status(201).json({success: true, message: user.fullName + " has successfully created an account.", redirect: "/signin.html"});
	    }
	});
    });
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
		    userStatus['redirect'] = "/home.html";

		    // Find devices based on decoded token
		    Device.find({ userEmail : decoded.email}, function(err, devices) {
			if (err) {
			    res.status(401).json({error: "Database Error"});
			} else {
			    // Construct device list
			    var deviceList = [];
			    for (device of devices) {
				deviceList.push({
				    deviceId: device.deviceId,
				    apikey: device.apikey,
				});
			    }
			    userStatus['devices'] = deviceList;
			    res.json(userStatus);
			}
		    });
		}
	    }
	});
    } catch (ex) {
	res.status(401).json({ error: "Invalid JWT" });
    }
});


/* POST confirm email for a registered user */
router.post("/confirm", function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('token', 'Token cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);

    // Find a matching token
    Token.findOne({ token: req.body.token }, function (err, token) {
	if (!token) {
	    return res.status(400).send({error: "Unable to find a valid conifrmation. Your requested confirmation may have already expired. \nPlease request another confirmation email"});
	}
	
	// Match the token in the DB with the respective user
	User.findOne({ _id: token._userId }, function (err, user) {
	    //Check if no user with the mathcing token is found
	    if (!user) return res.status(400).send({ error: 'We were unable to find a user matching the confirmation request' });
	    //Check if user is already verified
	    if (user.isVerified) return res.status(400).send({ error: 'This user account has already been verified. Please sign in.' });

	    // Verify and save the user
	    user.isVerified = true;
	    user.save(function (err) {
		if (err) { return res.status(500).send({ error: err.message }); }
		res.status(200).send("The account for " + user.fullName + " has been verified. Please sign in");
	    });
	});
    });
});

/* POST resend confirmation email */
router.post("/resend", function(req, res, next) {

    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);

    User.findOne({ email: req.body.email }, function (err, user) {
	//Check if there is no user matching the provided email
	if (!user) return res.status(400).send({ error: 'User Not Found.' });
	//Check if user account is already verified
	if (user.isVerified) return res.status(400).send({ error: 'This user account has already been verified. Please sign in.' });

	// Create a verification token, save it, and send email
	var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

	// Save the token
	token.save(function (err) {
	    if (err) {
		return res.status(500).send({ error: err.message });
	    }
	    // Send the email
	    var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
	    var mailOptions = { from: 'no-reply@SunSmart.com', to: user.email, subject: 'Confirm Your SunSmart Account',text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirm\/' + token.token + '.\n' };
	    transporter.sendMail(mailOptions, function (err) {
		if (err) {
		    return res.status(500).send({error: err.message});
		}

		res.status(201).send({success: true, message: user.fullName + " has successfully created an account. A verification email has been sent to " + user.email + "." , redirect: "/signin.html"});

	    });
	});
    });
});



module.exports = router;
