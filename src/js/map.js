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
				<a class="location-search-btn"><i class="fa fa-search fa-lg"></i></a>\
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
	this.getNewCityDetails();


	//убираем лишние блоки yandex map
	document.getElementsByClassName('ymaps-copyrights-pane')[0].style.display = 'none';
	

	//по клику на карту перерисовываем карту
	myMap.events.add('click', function(event) {        
		coords = event.get('coordPosition');
		this.getNewCityDetails();
	}.bind(this));	


	//при перетягивании карты перерисовыааем карту
	myMap.events.add('boundschange', function(event) {
		if (event.get('newCenter') != event.get('oldCenter')) {		
			this.getNewCityDetails();
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



this.getNewCityDetails = function() {	
	var center = myMap.getCenter();
	var newCenter = [center[0].toFixed(6), center[1].toFixed(6)];
	this.coordsToString = newCenter.join(',');

	return fetch('https://geocode-maps.yandex.ru/1.x/?geocode=' + this.coordsToString + '&sco=latlong&kind=locality&format=json').then(function (req) {
		return req.json();
	}).then(function (data) {
		this.cityName = data.response.GeoObjectCollection.featureMember["0"].GeoObject.name;
		document.getElementsByClassName('location-search')[0].placeholder = this.cityName;
	}.bind(this));
};



this.searchCityByName = function() {
	var name = document.getElementsByClassName('location-search')[0].value;
	if (name == '') {
		return;
	}
	return fetch('https://geocode-maps.yandex.ru/1.x/?geocode=' + name + '&sco=latlong&kind=locality&format=json').then(function (req) {
		return req.json();
	}).then(function (data) {
		var coords = this.stringCoordsToArray(data.response.GeoObjectCollection.featureMember["0"].GeoObject.Point.pos);
		myMap.setCenter(coords, 10);
		
		this.getNewCityDetails();
		document.getElementsByClassName('location-search')[0].value = '';
	}.bind(this));
};



this.addNewCityToList = function() {
	if (document.getElementsByClassName('location-search')[0].placeholder != document.getElementsByClassName('current-city')[0].innerHTML) {
		eventBus.trigger('add-city', {cityName: this.cityName, coordsToString: this.coordsToString});
	} else {
		document.getElementsByClassName('widget')[0].removeChild(document.getElementsByClassName('location-wrapper-cover')[0]);
	}
};

	//отрисовка карты yandex
	ymaps.ready(this.initMap.bind(this));


	document.querySelector('.location-search-btn').addEventListener('click', this.searchCityByName.bind(this));
	document.querySelector('.location-confirm-btn').addEventListener('click', this.addNewCityToList.bind(this));

}
