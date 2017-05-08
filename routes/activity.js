var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose');
var SessionActivity = mongoose.model('SessionActivity');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/', isAuthenticated);


router.route('/:id')
	//gets specified session
	.get(function(req, res){
		SessionActivity.find({session : req.params.id}, function(err, activities){
			if(err)
				res.send(err);
			res.json(activities);
		});
	}) 
	

module.exports = router;