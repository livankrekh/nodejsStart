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

app.get('/', function(request, response) {
	var html = fs.readFileSync('resp.html', 'utf8');

	db.initTables();
	response.send(html);
	console.log("File send! 200");
	db.selectFromOperations(default_callback);
	db.selectFromCards(default_callback);
});

app.post('/api/add/', function(request, response) {
	var dataInCards = {contract_id: request.body.contract_id, balance: 0};
	var dataInOperations = {contract_id: request.body.contract_id, bill: request.body.bill, type: request.body.type === true ? 'D' : 'W'};

	if (dataInOperations.contract_id.length === 17 && dataInOperations.contract_id.startsWith("2625")) {
		db.insertInOperations(dataInOperations);
		response.json(dataInCards);
        	response.end();
	} else {
		console.log(null);
		response.json(null);
		response.end();
	}
});

app.listen(8080);
