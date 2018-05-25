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