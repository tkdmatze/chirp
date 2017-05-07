var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var SessionActivity = mongoose.model('SessionActivity');
var Kpi = mongoose.model('Kpi');
var enums = require('../public/shared/enums');
var moment = require('moment');

router.route('/')
	// just log
	.post(function (req, res) {
		handleAction(req.sessionID, req.body.action);

	});

function handleAction(session, action) {
	if (enums[action]) {
		var kpi = enums[action].key;
		if (enums[action].onceASession) {
			SessionActivity.find({ session: session, action: action }).exec(function (err, result) {
				if (err) {
					console.log(err);
				} else {
					if (result && result.length == 0) {
						kpiExists(kpi, increaseKpi, createKpi);
					}
				}
			});
		} else {
			kpiExists(kpi, increaseKpi, createKpi);
		}
	}
	// log any action anyway
	var newActivity = new SessionActivity();
	newActivity.session = session;
	newActivity.action = action;
	newActivity.save();
}

function kpiExists(kpi, callback_yes, callback_no) {
	var today = moment().startOf('day')
	var tomorrow = moment(today).add(1, 'days').subtract(1, 'second');
	var query = Kpi.find({
		name: kpi,
		day: {
			$gte: today.toDate(),
			$lt: tomorrow.toDate()
		}
	})
	query.exec().then(function (result) {
		result && result.length ? callback_yes(kpi) : callback_no(kpi);
	})
}

function createKpi(kpi_name) {
	var kpi = new Kpi();
	kpi.name = kpi_name;
	kpi.save(function (err, res) {
		if (err) {
			console.log(err);
		}
	});
}

function increaseKpi(kpi) {
	var today = moment().startOf('day')
	var tomorrow = moment(today).add(1, 'days').subtract(1, 'second');
	Kpi.findOne({
		name: kpi,
		day: {
			$gte: today.toDate(),
			$lt: tomorrow.toDate()
		}
	}).exec(function (err, res) {
		if (err) {
			console.log(err);
		} else {
			if (res) {
				res.number = res.number + 1;
				res.save(function (err, res) {
					if (err) {
						console.log(err);
					}
				});
			}
		}
	});
}

module.exports = router;