var express = require('express');
var router = express.Router();
var path = require('path');

/* GET list of all sensor data */
router.get("/", function(req, res) {
    
    var name = req.query.name;
//    if (name !== null && name !== undefined) {
//	return res.status(201).send("Success: " + name);
//	console.log("Working");
//    }
//    else {
//	res.status(401).send("No Name!");
    //    }

    console.log(__dirname);

});

module.exports = router;
