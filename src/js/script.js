window.onload = function() {
	location.hash = '';
}

var mainScreenCity; 
var myMap;
var coords;
var cityName;
var lsArray;
var arrayFromString;
var coordsToString;
var daysExtended;
var days;
var selectedTempOption;
var selectedWindOption;



function toCelcius(temp) {
	if (localStorage.getItem('temp-unit') == 'F°') {
		return Math.floor(temp);
	} else {
		return Math.floor(((temp - 32)/2)*11/10);
	}
	
}

function toKilometers(speed) {
	if (localStorage.getItem('wind-unit') == 'миль/ч') {
		return ((speed)/0.6213).toFixed(1) + ' миль/ч';
	} else {
		return speed.toFixed(1) + ' км/ч';
	}
	
}


function iconToDescr(icon) {
	switch(icon) {
		case 'clear-day': return 'Ясно';
		break;
		case 'clear-night': return 'Ясно';
		break;
		case 'partly-cloudy-day': return 'Пасмурно';
		break;
		case 'partly-cloudy-night': return 'Пасмурно';
		break;
		case 'cloudy': return 'Облачно';
		break;
		case 'rain': return 'Дождь';
		break;
		case 'sleet': return 'Слякоть';
		break;
		case 'snow': return 'Снег';
		break;
		case 'wind': return 'Ветрено';
		break;
		case 'fog': return 'Туман';
		break;

	}
}


function toRegDate(stamp) {
	var d = new Date(stamp * 1000);
	var dd, mm;
	if (d.getDate() < 10) {
		dd = '0' + d.getDate();
	} else {
		dd = d.getDate();
	}

	if (d.getMonth() + 1 < 10) {
		mm = '0' + (d.getMonth() + 1);
	} else {
		mm = d.getMonth() + 1;
	}

	return dd + '.' + mm;
}


var wind;

function windBearing(num) {
	if (num < 11 || num >= 348) { return wind = 'С';}
	else if (num >= 11 && num < 78) {return wind = 'СВ';}
	else if (num >= 79 && num < 101) {return wind = 'В';}
	else if (num >= 101 && num < 168) {return wind = 'ЮВ';}
	else if (num >= 169 && num < 191) {return wind = 'Ю';}
	else if (num >= 191 && num < 258) {return wind = 'ЮЗ';}
	else if (num >= 158 && num < 281) {return wind = 'З';}
	else if (num >= 281 && num < 348) {return wind = 'СЗ';}
}


var chartDataMax = [];
var chartDataMin = [];
var chartLabels = [];


