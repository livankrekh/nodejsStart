const http = require('http')
var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
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

function errorCallback(error, errorCode, response) {
	console.log(error);
	response.json({error: errorCode});
	response.end();
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

app.post('/api/add/', function(request, response) {
	var dataInCards = {contract_id: request.body.contract_id, balance: 0};
	var dataInOperations = {contract_id: request.body.contract_id, bill: request.body.bill, type: request.body.type === true ? 'D' : 'W'};

	if (dataInOperations.contract_id.length === 17 && dataInOperations.contract_id.startsWith("2625") && dataInOperations.bill !== 0) {
		db.selectFromDBwithSelector("cards", dataInCards.contract_id, function(err, res) {
			if (err) {
				errorCallback(err, 3, response);
				return ;
			}
			if (!res || res.length === 0) {
				dataInCards.balance = dataInOperations.bill * (request.body.type ? 1 : -1);
				db.insertInCards(dataInCards, function(err, res) {
					if (err) response.json({error: 6});
				});
			} else {
				dataInCards.balance = res[0].balance + (dataInOperations.bill * (request.body.type === true ? 1 : -1));
				db.changeRowInDB("cards", dataInCards.balance, dataInCards.contract_id, function(err, res) {
					if (err) response.json({error: 6});
				});
			}
		});
		db.insertInOperations(dataInOperations, function (err, res) {
			if (err) response.json({error: 5});
			else {
				db.selectFromDB("operations", function(error, result) {
					if (error) response.json({error: 2});
					else response.json(result);
        			response.end();
				});
			}
		});
	} else {
		response.json({error: 1});
		response.end();
	}
});

app.post('/api/cancel/', function(request, response) {
	var data = request.body;

	if (data.token === "weewquewiqy343ui12y43iughewriueyoqbewrioe") {
		db.selectFromDBwithSelector("operations", data.contract_id, function(err, res) {
			if (err) {
				errorCallback(err, 3, response);
			} else {
				var lastAction = res[res.length - 1];

				db.selectFromDBwithSelector("cards", lastAction.contract_id, function(err, res) {
					if (err) {
						errorCallback(err, 3, response);
					} else {
						var newBalance = res[0].balance + (lastAction.bill * (res[0].type === 'D' ? -1 : 1));

						db.changeRowInDB("cards", newBalance, lastAction.contract_id, function(err, res) {
							if (err) {
								errorCallback(err, 6, response);
							}
						});
						db.removeFromDB("operations", lastAction.id, function(err, res) {
							if (err) {
								errorCallback(err, 6, response);
							} else {
								db.selectFromDB("operations", function(err, res) {
									if (err) {
										errorCallback(err, 6, response);
									} else {
										response.json(res);
										response.end();
									}
								});
							}
						});
					}
				});
			}
		});
	} else {
		response.json({error: 7});
		response.end();
	}
});

app.listen(8080);
