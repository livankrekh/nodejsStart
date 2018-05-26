const http = require('http')
var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var async = require('async');
var db = require('./db.js');

var app = express();

app.use(bodyParser.json());

function default_callback(err, res) {
	if (err) {
		console.log(err);
	} else {
		console.log(res);
	}
}

app.get('/', function(request, response) {
	var html = fs.readFileSync('resp.html', 'utf8');

	db.initTables();
	response.send(html);
	console.log("File send! 200");
	db.selectFromDB("cards", default_callback);
	db.selectFromDB("operations", default_callback);
});

app.get('/requestScript.js', function(request, response) {
	var js = fs.readFileSync('requestScript.js', 'utf8');

	response.send(js);
	console.log("JS script send! 200");
});

// Add new operation and change balance

app.post('/api/add/', function(request, response) {
	var dataInCards = {contract_id: request.body.contract_id, balance: 0};
	var dataInOperations = {contract_id: request.body.contract_id, bill: request.body.bill, type: request.body.type === true ? 'D' : 'W'};

	function getUserCard(callback) {
		db.selectFromDBwithSelector("cards", dataInCards.contract_id, function(err, res) {
			if (err) {
				callback(err, {error: 3});
			} else {
				callback(null, res);
			}
		});
	}

	function changeUserBalance(prevResult, callback) {
		if (!prevResult || prevResult.length === 0) {
			dataInCards.balance = dataInOperations.bill * (request.body.type ? 1 : -1);
			db.insertInCards(dataInCards, function(err, res) {
				if (err) {
					callback(err, {error: 6});
				} else {
					callback(null);
				}
			});
		} else {
			dataInCards.balance = prevResult[0].balance + (dataInOperations.bill * (request.body.type === true ? 1 : -1));
			db.insertInCards(dataInCards, function(err, res) {
				if (err) {
					callback(err, {error: 6});
				} else {
					callback(null);
				}
			});
		}
	}

	function addNewOperation(callback) {
		db.insertInOperations(dataInOperations, function (err, res) {
			if (err) {
				callback(err, {error: 5});
			} else {
				callback(null);
			}
		});
	}

	function getAllDataAndResponce(callback) {
		db.selectFromDB("operations", function(err, res) {
			if (err) {
				callback(err, {error: 2});
			} else {
				response.json(res);
				response.end();
			}
		});
	}

	if (dataInOperations.contract_id.length === 17 && dataInOperations.contract_id.startsWith("2625") && dataInOperations.bill !== 0) {
		async.waterfall([
			getUserCard,
			changeUserBalance,
			addNewOperation,
			getAllDataAndResponce
		],
		function(error, errorCode) {
			if (err) {
				console.log(err);
				response.json(errorCode);
				response.end();
			}
		});
	}
});

// Cancel last operation of user and change balance

app.post('/api/cancel/', function(request, response) {
	var data = request.body;

	function getFromCards(callback) {
		db.selectFromDBwithSelector("operations", data.contract_id, function(err, res) {
			if (err) {
				callback(err, {error: 8});
			} else {
				callback(null, res);
			}
		});
	}

	function getFromOperations(result, callback) {
		var lastAction = result[result.length - 1];

		db.selectFromDBwithSelector("cards", lastAction.contract_id, function(err, res) {
			if (err) {
				callback(err, {error: 3});
			} else {
				callback(null, res, lastAction);
			}
		});
	}

	function changeInCards(result, lastAction, callback) {
		var newBalance = result[0].balance + (lastAction.bill * (result[0].type === 'D' ? -1 : 1));

		db.changeRowInDB("cards", newBalance, lastAction.contract_id, function(err, res) {
			if (err) {
				callback(err, {error: 6});
			} else {
				callback(null, lastAction);
			}
		});
	}

	function removeInOperations(lastAction, callback) {
		db.removeFromDB("operations", lastAction.id, function(err, res) {
			if (err) {
				callback(err, {error: 9});
			} else {
				callback(null);
			}
		});
	}

	function getAllOperations(callback) {
		db.selectFromDB("operations", function(err, res) {
			if (err) {
				callback(err, {error: 8});
			} else {
				response.json(res);
				response.end();
				callback(null);
			}
		});
	}

	if (data.token === "weewquewiqy343ui12y43iughewriueyoqbewrioe") {

		// Start queue of cancel operation

		async.waterfall([
			getFromCards,
			getFromOperations,
			changeInCards,
			removeInOperations,
			getAllOperations
		],
		function(error, errorCode) {
			if (error) {
				console.log(error);
				response.json(errorCode);
				response.end();
			}
		});
	} else {
		response.json({error: 7});
		response.end();
	}
});

app.listen(8080);
