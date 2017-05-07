var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose');
var SessionActivity = mongoose.model('SessionActivity');


router.route('/')
	// just log
	.post(function(req, res){
		
		var newActivity = new SessionActivity();
		newActivity.session = req.sessionID;
		newActivity.action = req.body.action;
		newActivity.save();
	});




module.exports = router;