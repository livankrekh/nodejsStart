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

function insertInCards(newVal, callback) {
	connect.query("INSERT INTO cards SET ?", newVal, callback);
}

function insertInOperations(newVal, callback) {
	connect.query("INSERT INTO operations SET ?", newVal, callback);
}

function removeFromDB(db, id, callback) {
	connect.query("DELETE FROM ?? WHERE id=?", [db, id], callback);
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
exports.removeFromDB = removeFromDB;
exports.initTables = initTables;
