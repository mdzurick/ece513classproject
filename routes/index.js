var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'SunSmart'});
	//res.sendFile('/public/home.html'); 
});

module.exports = router;
