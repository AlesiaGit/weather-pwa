class CitiesList {

	constructor() {

		document.body.innerHTML = '';
		this.widget = document.createElement('div');
		this.widget.className = 'widget';
		document.body.appendChild(this.widget);


		this.locationScreen = document.createElement('div');
		this.locationScreen.className = 'widget-wrapper-location';
		this.locationScreen.innerHTML = '\
		<div class="location-header">\
			<button class="location-change-btn">Изменить</button>\
			<button class="location-cancel-change-btn">Отменить</button>\
			<div class="location-header-divider"></div>\
		</div>\
		<div class="location-block"></div>';
		this.widget.appendChild(this.locationScreen);


		this.locationScreenBottom = document.createElement('div');
		this.locationScreenBottom.className = 'bottom-location';
		this.locationScreenBottom.innerHTML = '\
		<a href="#map" class="location-add-btn"></a>\
		<a class="location-delete-btn"></a>\
		<div class="add-del-btn-descr">Добавить</div>';
		this.widget.appendChild(this.locationScreenBottom);

		this.buildDomFromLocalStorage();

		document.querySelector('.location-change-btn').addEventListener('click', this.changeCityList);

		document.querySelector('.location-delete-btn').addEventListener('click', this.deleteCityFromList);

		document.querySelector('.location-cancel-change-btn').addEventListener('click', this.cancelChangeCityList);

		eventBus.on('add-city', this.addNewCityToList.bind(this));

	}

	

	buildDomFromLocalStorage() {

		ymaps.ready(function() {

			cityName = ymaps.geolocation.city;

			lsArray = JSON.parse(localStorage.getItem('cities')) || [];
			lsArray.forEach(function(elem) {

				if (elem['city'] == undefined || elem['coords'] == undefined) {
					lsArray.splice(lsArray.indexOf(elem), 1);
				} else {
					var newLocation = document.createElement('div');
					newLocation.className = 'location-list';
					newLocation.innerHTML = '\
					<a class="location-item" href="#">\
						<div class="location-city"></div>\
						<input type="checkbox" class="location-city-del">\
					</a>\
					<div class="location-divider"></div>';

					newLocation.getElementsByClassName('location-city-del')[0].style.display = 'none';
					newLocation.getElementsByClassName('location-item')[0].href = '#today=' + elem['coords'];

					if (elem['city'] == cityName) {
						newLocation.getElementsByClassName('location-city')[0].innerHTML = '<span class="current-city">' + elem['city'] + '</span><i class="fa fa-map-marker my-location-marker"></i></div>';
						document.getElementsByClassName('location-block')[0].insertBefore(newLocation, document.getElementsByClassName('location-block')[0].firstChild);

						var comment = document.createElement('div');
						comment.className = 'location-comment';
						comment.innerHTML = 'Текущее местоположение';
						newLocation.getElementsByClassName('location-item')[0].appendChild(comment);

					} else {
						newLocation.getElementsByClassName('location-city')[0].innerHTML = elem['city'];
						document.getElementsByClassName('location-block')[0].appendChild(newLocation);
					}
				}
			});
		});
	}



	changeCityList() {
		
		var checkboxArray = document.getElementsByClassName('location-city-del');
		for (var i = 0; i < checkboxArray.length; i++) {
			if (checkboxArray[i].previousElementSibling.children.length == 0) {
				checkboxArray[i].style.display = 'block';
			}
		}

		document.getElementsByClassName('location-delete-btn')[0].style.display = 'block';
		document.getElementsByClassName('location-add-btn')[0].style.display = 'none';
		document.getElementsByClassName('add-del-btn-descr')[0].innerHTML = 'Удалить';
		document.getElementsByClassName('location-change-btn')[0].style.display = 'none';
		document.getElementsByClassName('location-cancel-change-btn')[0].style.display = 'block';

	}



	deleteCityFromList() {

		var checkboxArray = document.getElementsByClassName('location-city-del');

		var elementsToDelete = Array.prototype.filter.call(checkboxArray, function (elem){
			return elem.checked;
		});
		var namesToDelete = elementsToDelete.map(function(elem) {
			return elem.parentNode.getElementsByClassName('location-city')[0].innerHTML;
		});

		lsArray = JSON.parse(localStorage.getItem('cities')) || [];	
		lsArray = lsArray.filter(function(elem) {
			return namesToDelete.indexOf(elem['city']) < 0;
		});

		/*namesToDelete.forEach(function(cityName) {
			var existing = lsArray.find(function(p) {
				return	p['city'] === cityName;
			});

			var i = lsArray.indexOf(existing);
			if (i >= 0) {
				lsArray.splice(i, 1);
			}
		});*/

		localStorage.setItem('cities', JSON.stringify(lsArray));

		elementsToDelete.forEach(function(elem) {
			elem.parentNode.parentNode.parentNode.removeChild(elem.parentNode.parentNode);
		});


		for (var i = 0; i < checkboxArray.length; i++) {
			checkboxArray[i].checked = false;
			checkboxArray[i].style.display = 'none';
		}

		document.getElementsByClassName('location-delete-btn')[0].style.display = 'none';
		document.getElementsByClassName('location-add-btn')[0].style.display = 'block';
		document.getElementsByClassName('add-del-btn-descr')[0].innerHTML = 'Добавить';
		document.getElementsByClassName('location-change-btn')[0].style.display = 'block';
		document.getElementsByClassName('location-cancel-change-btn')[0].style.display = 'none';

	}



	cancelChangeCityList() {
		
		var checkboxArray = document.getElementsByClassName('location-city-del');
		for (var i = 0; i < checkboxArray.length; i++) {
			checkboxArray[i].checked = false;
			checkboxArray[i].style.display = 'none';
		}

		document.getElementsByClassName('location-delete-btn')[0].style.display = 'none';
		document.getElementsByClassName('location-add-btn')[0].style.display = 'block';
		document.getElementsByClassName('add-del-btn-descr')[0].innerHTML = 'Добавить';
		document.getElementsByClassName('location-change-btn')[0].style.display = 'block';
		document.getElementsByClassName('location-cancel-change-btn')[0].style.display = 'none';

	}



	addNewCityToList (data) {
		
		var array = document.getElementsByClassName('location-city');

		for (var key in array) {
			if (array[key].innerHTML == data.cityName) {
				return;
			}
		}

		var newLocation = document.createElement('div');
		newLocation.className = 'location-list';
		newLocation.innerHTML = '\
		<a class="location-item" href="#">\
			<div class="location-city"></div>\
			<input type="checkbox" class="location-city-del">\
		</a>\
		<div class="location-divider"></div>';

		newLocation.getElementsByClassName('location-city-del')[0].style.display = 'none';
		newLocation.getElementsByClassName('location-city')[0].innerHTML = data.cityName;
		newLocation.getElementsByClassName('location-item')[0].href = '#today=' + data.coordsToString;
		document.getElementsByClassName('location-block')[0].appendChild(newLocation);

		var cities = {};
		cities['city'] = data.cityName;
		cities['coords'] = data.coordsToString;
		cities['data'] = '';
		lsArray.push(cities);
		localStorage.setItem('cities', JSON.stringify(lsArray));

	}

}