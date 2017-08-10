var Map = function() {

	this.cityName = '';
	this.coordsToString = '';
	this.mapScreen = document.createElement('div');
	this.mapScreen.className = 'location-wrapper-cover';
	this.mapScreen.innerHTML = '\
	<div class="location-map-wrapper">\
		<div class="location-map" id="YMapsID">\
			<div class="location-search-wrapper">\
				<input class="location-search" placeholder="Введите название города..." autofocus>\
				<a href="#change-location" class="location-confirm-btn"><i class="fa fa-check fa-lg"></i></a>\
			</div>\
		</div>\
	</div>';
	
	//document.body.appendChild(this.mapScreen);
	document.getElementsByClassName('widget')[0].appendChild(this.mapScreen);
	document.getElementById('YMapsID').style.height = window.screen.height/2 + 'px';



this.initMap = function() {
	//всегда отстраиваем карту по текущей геолокации пользователя
	var geolocation = ymaps.geolocation;
	coords = [ymaps.geolocation.latitude, ymaps.geolocation.longitude];
	
	myMap = new ymaps.Map('YMapsID', {
		center: coords,
		zoom: 10, 
        autoFitToViewport: 'always'
    });
	this.getNewCoordinates();


	//убираем лишние блоки yandex map
	document.getElementsByClassName('ymaps-copyrights-pane')[0].style.display = 'none';
	

	//по клику на карту перерисовываем карту
	myMap.events.add('click', function(event) {        
		coords = event.get('coordPosition');
		this.getNewCoordinates();
	}.bind(this));	


	//при перетягивании карты перерисовыааем карту
	myMap.events.add('boundschange', function(event) {
		if (event.get('newCenter') != event.get('oldCenter')) {		
			this.getNewCoordinates();
		}
	}.bind(this));
};


this.stringCoordsToArray = function(string) {
	var arr = string.split(' ');
	var reverseArr = arr.reverse();
	arrayFromString = reverseArr.map(function(element) {
		return Number(element);
	});
	return arrayFromString;
};


this.getNewCoordinates = function() {	
	var center = myMap.getCenter();
	var newCenter = [center[0].toFixed(6), center[1].toFixed(6)];
	this.coordsToString = newCenter.join(',');

	//фетчим координаты центра карты для получения названия города	
	this.draggedCityName(this.coordsToString);
};


this.draggedCityName = function(coordsToString) {
	return fetch('https://geocode-maps.yandex.ru/1.x/?geocode=' + coordsToString + '&sco=latlong&kind=locality&format=json').then(function (req) {
		return req.json();
	}).then(function (data) {
		var name = data.response.GeoObjectCollection.featureMember["0"].GeoObject.name;
		document.getElementsByClassName('location-search')[0].placeholder = name;
		this.cityName = name;
	}.bind(this));
};


this.searchCityByName = function(addr) {
	return fetch('https://geocode-maps.yandex.ru/1.x/?geocode=' + addr + '&sco=latlong&kind=locality&format=json').then(function (req) {
		return req.json();
	}).then(function (data) {
		this.cityName = data.response.GeoObjectCollection.featureMember["0"].GeoObject.name;
		this.coordsToString = this.stringCoordsToArray(data.response.GeoObjectCollection.featureMember["0"].GeoObject.Point.pos).join(',');
		this.addNewCityToList();
	}.bind(this));
};


this.addCityToFavorites = function() {
	if (document.getElementsByClassName('location-search')[0].value != "") {
		var addr = document.getElementsByClassName('location-search')[0].value;
		this.searchCityByName(addr);
		return;
	} 

	this.addNewCityToList();
};

this.addNewCityToList = function() {
	eventBus.trigger('add-city', {cityName: this.cityName, coordsToString: this.coordsToString});

};

	//отрисовка карты yandex
	ymaps.ready(this.initMap.bind(this));

	//по нажатию на кнопку добавляем выбранный город в список
	document.querySelector('.location-confirm-btn').addEventListener('click', this.addCityToFavorites.bind(this));

}
