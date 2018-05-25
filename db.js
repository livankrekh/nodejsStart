const mysql = require('mysql')
const connect = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '12345678',
	database : 'testCards'
});

function dumpDB(db, callback) {
	connect.query("SELECT * FROM ??", [db], callback);
}

function dumpDBwithSelector(db, selector, callback) {
	connect.query("SELECT * FROM ?? WHERE contract_id=?", [db, selector], callback);
}

function changeRowInDB(db, values, selector, callback) {
	connect.query("UPDATE ?? SET balance=? WHERE contract_id=?", [db, values, selector], callback);
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

exports.selectFromDB = dumpDB;
exports.selectFromDBwithSelector = dumpDBwithSelector;
exports.changeRowInDB = changeRowInDB;
exports.insertInCards = insertInCards;
exports.insertInOperations = insertInOperations;
exports.initTables = initTables;
