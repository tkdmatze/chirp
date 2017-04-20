var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose');
var Session = mongoose.model('Session');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/', isAuthenticated);

router.route('/')
	//gets all sessions
	.get(function(req, res){
		Session.find(function(err, sessions){
			if(err){
				return res.send(500, err);
			}
			return res.send(200,sessions);
		});
	});


router.route('/:id')
	//gets specified session
	.get(function(req, res){
		Session.findById(req.params.id, function(err, session){
			if(err)
				res.send(err);
			res.json(session);
		});
	}) 
	//deletes the session
	.delete(function(req, res) {
		Session.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});

module.exports = router;