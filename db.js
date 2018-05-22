const mysql = require('mysql')
const connect = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '12345678',
	database : 'testCards'
});

function dumpDBcards() {
	connect.query("SELECT contract_id FROM cards", function(err, result) {
		if (err) {
			console.log(err);
			return null;
		}
		else {
			console.log(result);
			return result;
		}
		return null;
	});
}

function dumpDBoperations() {
	connect.query("SELECT card_id FROM operations", function(err, result) {
		if (err) {
			console.log(err);
			return null;
		}
		else {
			console.log(result);
			return result;
		}
		return null;
	});
}

function insertInCards(newVal) {
	connect.query("INSERT INTO cards SET ?", newVal, function(err, result) {
		if (err) console.log(err);
		else console.log(result);
	});
}

function insertInOperations(newVal) {
	connect.query("INSERT INTO operations SET ?", newVal, function(err, result) {
		if (err) console.log(err);
		else console.log(result);
	});
}

function initTables() {
	connect.query("CREATE TABLE IF NOT EXISTS operations (id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL, contract_id VARCHAR(18) NOT NULL, bill FLOAT NOT NULL, type ENUM('D', 'W'), date TIMESTAMP NOT NULL)",
		function(error, result) {
			if (error) {
				console.log(error);
			} else {
				console.log("Default table 'operations' in 'testCards' database created!");
			}
		});

	connect.query("CREATE TABLE IF NOT EXISTS cards (id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL, contract_id VARCHAR(18) NOT NULL, balance FLOAT NOT NULL)",
		function(error, result) {
			if (error) {
				console.log(error);
			} else {
				console.log("Default table 'cards' in 'testCards' database created!");
			}
		});
}

exports.selectFromCards = dumpDBcards;
exports.selectFromOperations = dumpDBoperations;
exports.insertInCards = insertInCards;
exports.insertInOperations = insertInOperations;
exports.initTables = initTables;
