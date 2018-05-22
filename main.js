const http = require('http')
var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var db = require('./db.js');

var app = express();

app.use(bodyParser.json());

app.get('/', function(request, response) {
	var html = fs.readFileSync('resp.html', 'utf8');

	db.initTables();
	response.send(html);
	console.log("File send! 200");
});

app.post('/api/add/', function(request, response) {
	var dataInCards = {contract_id: request.body.contract_id, balance: request.body.bill};

	console.log(dataInCards);
	response.json(dataInCards);
	response.end();
});

app.listen(8080);
