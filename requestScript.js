var button = document.getElementById("sendRequest");
var contract_field = document.getElementById("contract");
var bill_field = document.getElementById("bill");
var type_field = document.getElementById("select_type");

var contractCancel = document.getElementById("contractCancel");
var token = document.getElementById("token");
var cancelButton = document.getElementById("sendCancel");

var div = document.getElementById("operationsBoard");

button.addEventListener("click", clickHandler);
cancelButton.addEventListener("click", cancelHandler);

function clickHandler() {
	let data = {
		contract_id: contract_field.value,
		bill: parseFloat(bill_field.value),
		type: type_field.selectedIndex === 0
	};
	axios.post('/api/add/', data).then(function (response) {
		if (response.data.error !== undefined) getError(response.data.error);
		else dataParses(response.data, div);
	}).catch(function (error) {
		getError(4);
	});
}

function cancelHandler() {
	let data = {
		contract_id: contractCancel.value,
		token: token.value
	};
	axios.post('/api/cancel/', data).then(function (response) {
		if (response.data.error !== undefined) getError(response.data.error);
		else dataParses(response.data, div);
	}).catch(function (error) {
		getError(4);
	});
}

function getError(errorCode) {
	switch (errorCode) {
		case 1: alert("Непривильно введены данные!\nНомер договора начинается с цифр '2625' и имеет 17 цифр\nСчет не может быть равень нулю");
		case 2: alert("Ошибка: не удалось внести данные в базу данных операций");
		case 3: alert("Ошибка: не удалось извлечь данные из базы данных договоров");
		case 4: alert("Ошибка: не удалось получить ответ от сервера");
		case 5: alert("Ошибка: не удалось внести данные в базу данных операций");
		case 6: alert("Ошибка: не удалось ищменить данные вашего договора");
		case 7: alert("Неправильный токен отмены операции");
	}
}

function dataParses(data, div) {
	while (div.firstChild) {
		div.removeChild(div.firstChild);
	}

	if (data === null) {
		return ;
	}
	for (var i = 0; i < data.length; i++) {
		var newTr = document.createElement("tr");
		var tdArray = [document.createElement("td"), document.createElement("td"), document.createElement("td"), document.createElement("td"), document.createElement("td")];

		console.log(data[i].contract_id, data[i].bill, data[i].type);
		tdArray[0].innerHTML = data[i].id;
		tdArray[1].innerHTML = data[i].contract_id;
		tdArray[2].innerHTML = data[i].bill;
		tdArray[3].innerHTML = data[i].type;
		tdArray[4].innerHTML = data[i].date;
		for (var j = 0; j < tdArray.length; j++) {
			newTr.appendChild(tdArray[j]);
		}
		div.appendChild(newTr);
	}
}
