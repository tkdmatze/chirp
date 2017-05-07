var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose');
var SessionActivity = mongoose.model('SessionActivity');
var enums = require('../public/shared/enums');

router.route('/')
	// just log
	.post(function(req, res){
		handleAction(req.sessionID, req.body.action );
		
	});

function handleAction(session, action){
		// log any action
        var newActivity = new SessionActivity();
		newActivity.session = session;
		newActivity.action = action;
		newActivity.save();
		if (enums[action]){
			console.log("i know this action");
		}

}

module.exports = router;