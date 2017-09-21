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

		ymaps.ready(function () {

			cityName = ymaps.geolocation.city;

			lsArray = JSON.parse(localStorage.getItem('cities')) || [];
			lsArray.forEach(function (elem) {

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

		var elementsToDelete = Array.prototype.filter.call(checkboxArray, function (elem) {
			return elem.checked;
		});
		var namesToDelete = elementsToDelete.map(function (elem) {
			return elem.parentNode.getElementsByClassName('location-city')[0].innerHTML;
		});

		lsArray = JSON.parse(localStorage.getItem('cities')) || [];
		lsArray = lsArray.filter(function (elem) {
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

		elementsToDelete.forEach(function (elem) {
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

	addNewCityToList(data) {

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
function EventBus() {
	this.listeners = {};
};

EventBus.prototype = {

	on: function (event, callback) {
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push(callback);
	},

	off: function (event, callback) {
		if (this.listeners[event]) {
			var callbackIndex = this.listeners[event].indexOf(callback);
			if (callbackIndex >= 0) {
				this.listeners[event].splice(callbackIndex, 1);
			}
		}
	},

	trigger: function (event, data) {
		(this.listeners[event] || []).forEach(function (callback) {
			return callback(data);
		});

		(this.listeners['once' + event] || []).forEach(function (callback) {
			return callback(data);
		});

		this.listeners['once' + event] = [];
	},

	once: function (event, callback) {
		this.listeners['once' + event] = this.listeners['once' + event] || [];
		this.listeners['once' + event].push(callback);
	}
};

class Extended {

	constructor(backHash) {

		this.backHash = backHash;

		document.body.innerHTML = '';
		this.widget = document.createElement('div');
		this.widget.className = 'widget';
		document.body.appendChild(this.widget);

		this.extendedWrapper = document.createElement('div');
		this.extendedWrapper.className = 'widget-extended-wrapper';

		this.extendedWrapper.innerHTML = '<div class="extended-header">\
				<div class="extended-title">Прогноз на 5 дней</div>\
				<div class="extended-dates"><span class="start-date">28.07</span>-<span class="end-date">01.08</span></div>\
			</div>\
			<table class="table">\
				<thead class="thead">\
					<tr class="extended-table-date">\
						<th class="th">\
							<div class="th-weekday"></div>\
							<div class="th-date"></div>\
						</th>\
						<th class="th">\
							<div class="th-weekday"></div>\
							<div class="th-date"></div>\
						</th>\
						<th class="th">\
							<div class="th-weekday"></div>\
							<div class="th-date"></div>\
						</th>\
						<th class="th">\
							<div class="th-weekday"></div>\
							<div class="th-date"></div>\
						</th>\
						<th class="th">\
							<div class="th-weekday"></div>\
							<div class="th-date"></div>\
						</th>\
					</tr>\
				</thead>\
				<tbody class="tbody">\
					<tr>\
						<td class="td-icon"></td>\
						<td class="td-icon"></td>\
						<td class="td-icon"></td>\
						<td class="td-icon"></td>\
						<td class="td-icon"></td>\
					</tr>\
					<tr>\
						<td class="td-descr"></td>\
						<td class="td-descr"></td>\
						<td class="td-descr"></td>\
						<td class="td-descr"></td>\
						<td class="td-descr"></td>\
					</tr>\
					<tr>\
						<td colspan="5" class="td-chart"><div class="chart-wrapper"><canvas id="myChart" height="250" width="600"></canvas></div></td>\
					</tr>\
					<tr>\
						<td class="td-wind-direction"></td>\
						<td class="td-wind-direction"></td>\
						<td class="td-wind-direction"></td>\
						<td class="td-wind-direction"></td>\
						<td class="td-wind-direction"></td>\
					</tr>\
					<tr>\
						<td class="td-wind-speed js-wind-speed"></td>\
						<td class="td-wind-speed js-wind-speed"></td>\
						<td class="td-wind-speed js-wind-speed"></td>\
						<td class="td-wind-speed js-wind-speed"></td>\
						<td class="td-wind-speed js-wind-speed"></td>\
					</tr>\
				</tbody>\
			</table>';

		this.widget.appendChild(this.extendedWrapper);

		this.ctx = document.getElementById("myChart");
		Chart.defaults.global.defaultFontFamily = 'Mi Lanting';
		Chart.defaults.global.defaultFontSize = 14;
		Chart.defaults.global.defaultFontColor = 'rgba(0,0,0,1)';
		this.ctx.style.width = window.innerWidth * window.devicePixelRatio;
		var dataLabels = [];
		dataLabels.length = 5;

		var myChart = new Chart(this.ctx, {
			type: 'line',
			data: {
				labels: dataLabels,
				datasets: [{
					label: false,
					data: chartDataMax,
					lineTension: 0,
					backgroundColor: 'rgba(0,0,0,0)',
					borderColor: 'rgba(0,0,0,0.5)',
					borderWidth: 1,
					pointBackgroundColor: 'rgba(255,255,255,1)',
					pointBorderWidth: 1

				}, {
					label: false,
					data: chartDataMin,
					lineTension: 0,
					backgroundColor: 'rgba(0,0,0,0)',
					borderColor: 'rgba(0,0,0,0.5)',
					borderWidth: 1,
					pointBackgroundColor: 'rgba(255,255,255,1)',
					pointBorderWidth: 1

				}]
			},
			options: {
				scales: {
					xAxes: [{
						display: false,
						ticks: {
							beginAtZero: true
						}
					}],
					yAxes: [{
						display: false,
						ticks: {
							beginAtZero: false
						}
					}],
					gridLines: [{
						display: false
					}],
					startValue: 2
				},
				responsive: true,
				legend: {
					display: false
				},
				layout: {
					padding: {
						top: 30,
						right: 15,
						left: 15,
						bottom: 30
					}
				},
				animation: {
					duration: 0,
					easing: 'linear',
					onComplete: function () {
						var ctx = this.chart.ctx;
						ctx.fillStyle = 'rgba(0,0,0,1)';
						ctx.textAlign = 'center';
						ctx.textBaseline = 'bottom';

						this.data.datasets.forEach(function (dataset) {
							for (var i = 0; i < dataset.data.length; i++) {
								for (var key in dataset._meta) {

									var model = dataset._meta[key].data[i]._model;
									if (dataset.data == chartDataMax) {
										ctx.fillText(dataset.data[i], model.x, model.y - 7);
									} else {
										ctx.fillText(dataset.data[i], model.x, model.y + 27);
									}
								}
							}
						});
					}
				}
			}
		});

		this.extendedFooter = document.createElement('div');
		this.extendedFooter.className = 'bottom-extended';
		this.extendedFooter.innerHTML = '<a href="#" class="extended-close-btn"></a>';
		this.widget.appendChild(this.extendedFooter);

		this.closeExtendedBtn = document.getElementsByClassName('extended-close-btn')[0];
		this.closeExtendedBtn.href = '#today=' + backHash;

		lsArray = JSON.parse(localStorage.getItem('cities')) || [];
		lsArray.forEach(function (elem) {
			if (elem['coords'] == backHash) {
				var data = elem['data'];

				document.getElementsByClassName('start-date')[0].innerHTML = toRegDate(data.daily.data[0].time);
				document.getElementsByClassName('end-date')[0].innerHTML = toRegDate(data.daily.data[4].time);

				var d = new Date();
				var weekday = d.getDay();
				var weekdaysArray = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
				daysExtended = ["Сегодня", "Завтра", weekdaysArray[(weekday + 2) % 7], weekdaysArray[(weekday + 3) % 7], weekdaysArray[(weekday + 4) % 7]];

				for (var i = 0; i < daysExtended.length; i++) {
					var table = document.getElementsByClassName('table')[0];
					table.rows[0].cells[i].children[0].innerHTML = daysExtended[i];
					table.rows[0].cells[i].children[1].innerHTML = toRegDate(data.daily.data[i].time);
					table.rows[1].cells[i].className = 'td-icon extended-' + data.daily.data[i].icon;
					table.rows[2].cells[i].innerHTML = iconToDescr(data.daily.data[i].icon);
					table.rows[4].cells[i].innerHTML = windBearing(data.daily.data[i].windBearing);
					table.rows[5].cells[i].innerHTML = toKilometers(data.daily.data[i].windSpeed);

					chartDataMax[i] = toCelcius(data.daily.data[i].apparentTemperatureMax);
					chartDataMin[i] = toCelcius(data.daily.data[i].apparentTemperatureMin);

					chartLabels[i] = daysExtended[i];
				}
			}
		});
	}
}

class MainScreen {

	constructor(coords) {
		this.coords = coords;

		this.coords = coords;
		this.cityName = '';
		this.coordsToString = '';

		document.body.innerHTML = '';
		this.widget = document.createElement('div');
		this.widget.className = 'widget';
		document.body.appendChild(this.widget);

		this.mainScreen = document.createElement('div');
		this.mainScreen.className = 'widget-wrapper';
		this.mainScreen.innerHTML = '\
		 	<div class="top-main">\
				<div class="top-data">\
					<div class="top-temp-wrapper">\
						<div class="top-temp"></div>\
						<div class="top-celcius">°</div>\
					</div>\
					<a class="top-dropdown"></a>\
				</div>\
				<div class="top-other-info"><span class="top-city"></span> | <span class="top-descr"></span></div>\
			</div>';

		this.widget.appendChild(this.mainScreen);

		this.mainScreenFooter = document.createElement('div');
		this.mainScreenFooter.className = 'bottom-main';
		this.mainScreenFooter.innerHTML = '\
		<a class="more-info" target="_blank">Подробнее<span><i class="fa fa-angle-right fa-lg my-top-angle-right"></i></span></a>\
				<div class="extended-data">\
					<div class="extended-day">\
						<div class="extended-icon"></div>\
						<div class="extended-wrapper">\
							<div class="extended-info">\
								<div class="extended-weekday"></div>\
								<div class="extended-descr"></div>\
							</div>\
							<div class="extended-temp"><span class="extended-max"></span>° / <span class="extended-min"></span>°</div>\
						</div>\
					</div>\
				</div>\
				<div class="divider divider-extended"></div>\
				<div class="extended-data">\
					<div class="extended-day">\
						<div class="extended-icon"></div>\
						<div class="extended-wrapper">\
							<div class="extended-info">\
								<div class="extended-weekday"></div>\
								<div class="extended-descr"></div>\
							</div>\
							<div class="extended-temp"><span class="extended-max"></span>° / <span class="extended-min"></span>°</div>\
						</div>\
					</div>\
				</div>\
				<div class="divider divider-extended"></div>\
				<div class="extended-data">\
					<div class="extended-day">\
						<div class="extended-icon"></div>\
						<div class="extended-wrapper">\
							<div class="extended-info">\
								<div class="extended-weekday"></div>\
								<div class="extended-descr"></div>\
							</div>\
							<div class="extended-temp"><span class="extended-max"></span>° / <span class="extended-min"></span>°</div>\
						</div>\
					</div>\
				</div>\
				<div class="divider"></div>\
				<div class="bottom-link"><a href="#" class="bottom-link-style">Прогноз на 5 дней</a></div>';

		this.widget.appendChild(this.mainScreenFooter);

		this.setMainPageInnerHTML();

		document.querySelector('.top-dropdown').addEventListener('click', this.showDropdownList.bind(this));
	}

	showDropdownList() {
		var wrapper = document.createElement('div');
		wrapper.className = 'widget-wrapper-cover';
		this.widget.appendChild(wrapper);

		var dropdownList = document.createElement('div');
		dropdownList.className = 'dropdown-list';
		dropdownList.innerHTML = '\
		<div class="dropdown-close-btn-wrapper">\
			<a class="dropdown-close"></a>\
		</div>\
		<ul class="dropdown-list-style">\
			<div class="dropdown-divider"></div>\
			<a href="" class="dropdown-link js-change-location">Изменить местоположение</a>\
			<div class="dropdown-divider"></div>\
			<a class="dropdown-link js-share">Поделиться</a>\
			<div class="dropdown-divider"></div>\
			<a href="" class="dropdown-link js-settings">Настройки</a>\
		</ul>';

		this.widget.appendChild(dropdownList);

		var topCloseBtn = document.querySelector('.dropdown-close');
		topCloseBtn.addEventListener('click', this.closeDropdownList.bind(this));

		document.querySelector('.js-change-location').href = '#change-location';
		document.querySelector('.js-share').addEventListener('click', this.showShareScreen.bind(this));
		document.querySelector('.js-settings').href = '#settings=' + window.location.hash.split('=').pop();
	}

	closeDropdownList() {

		this.widget.removeChild(document.querySelector('.widget-wrapper-cover'));
		this.widget.removeChild(document.querySelector('.dropdown-list'));
	}

	getMainPageWeatherData() {

		var coords = this.coords;
		if (!coords) return;
		return fetch('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/14b2f0cd9db914c3bbf4ab5e43ac514d/' + coords).then(function (req) {
			return req.json();
		}).then(function (data) {

			var d = new Date();
			var weekday = d.getDay();
			var weekdaysArray = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
			days = ["Сегодня", "Завтра", weekdaysArray[(weekday + 2) % 7]];

			document.querySelector('.top-temp').innerHTML = toCelcius(data.currently.apparentTemperature);
			document.querySelector('.top-descr').innerHTML = iconToDescr(data.currently.icon);

			for (var i = 0; i < days.length; i++) {
				var parent = document.getElementsByClassName('extended-data')[i];
				parent.querySelector('.extended-max').innerHTML = toCelcius(data.daily.data[i].apparentTemperatureMax);
				parent.querySelector('.extended-min').innerHTML = toCelcius(data.daily.data[i].apparentTemperatureMin);
				parent.querySelector('.extended-weekday').innerHTML = days[i];
				parent.querySelector('.extended-descr').innerHTML = iconToDescr(data.daily.data[i].icon);
				parent.querySelector('.extended-day').firstElementChild.className = 'extended-icon ' + data.daily.data[i].icon;
			}

			lsArray = JSON.parse(localStorage.getItem('cities')) || [];
			lsArray.forEach(function (elem) {
				if (elem['coords'] == coords) {
					elem['data'] = data;
					document.querySelector('.top-city').innerHTML = elem['city'];
					this.coordsToString = elem['coords'];
					this.cityName = elem['city'];
				}
			}.bind(this));
			localStorage.setItem('cities', JSON.stringify(lsArray));
		}.bind(this));
	}

	setMainPageInnerHTML() {

		if (window.location.hash == '') {
			ymaps.ready(function () {
				cityName = ymaps.geolocation.city;
				coordsToString = ymaps.geolocation.latitude + ',' + ymaps.geolocation.longitude;

				document.getElementsByClassName('top-city')[0].innerHTML = cityName;
				document.querySelector('.bottom-link-style').href = '#extended=' + coordsToString;
				document.querySelector('.more-info').href = 'https://darksky.net/forecast/' + coordsToString + '/si24/en';
				window.location.hash = '#today=' + coordsToString;

				lsArray = JSON.parse(localStorage.getItem('cities')) || [];
				lsArray.forEach(function (elem) {
					if (elem['city'] == cityName) {
						lsArray.splice(lsArray.indexOf(elem), 1);
					}
				});

				var cities = {};
				cities['city'] = cityName;
				cities['coords'] = coordsToString;
				cities['data'] = '';
				lsArray.push(cities);
				localStorage.setItem('cities', JSON.stringify(lsArray));
				this.getMainPageWeatherData(coordsToString);
			}.bind(this));
			return;
		} else {
			coordsToString = location.hash.split('=').pop();
			document.querySelector('.bottom-link-style').href = '#extended=' + coordsToString;
			document.querySelector('.more-info').href = 'https://darksky.net/forecast/' + coordsToString + '/si24/en';
			this.getMainPageWeatherData(coordsToString);
		}
	}

	showShareScreen() {

		this.closeDropdownList();

		var wrapper = document.createElement('div');
		wrapper.className = 'widget-wrapper-cover';
		this.widget.appendChild(wrapper);

		var shareBlock = document.createElement('div');
		shareBlock.className = 'share-block';
		shareBlock.innerHTML = '\
		<div class="share-title">Поделиться</div>\
		<div class="share-icons">\
			<a href="" class="ssk share-item share-item-facebook"></a>\
			<a href="" class="ssk share-item share-item-pinterest"></a>\
			<a href="" class="ssk share-item share-item-vk"></a>\
			<a href="" class="ssk share-item share-item-google-plus"></a>\
		</div>\
		<div class="share-divider"></div>\
		<a href="" class="share-cancel-btn">Отмена</a>';

		this.widget.appendChild(shareBlock);

		SocialShareKit.init({
			selector: '.ssk',
			url: '',
			text: 'Here is weather from my weather widget'
		});

		var links = document.getElementsByClassName('ssk');
		for (var i = 0; i < links.length; i++) {
			links[i].addEventListener('click', this.hideShareScreen.bind(this));
		}

		document.getElementsByClassName('share-cancel-btn')[0].addEventListener('click', this.hideShareScreen.bind(this));
	}

	hideShareScreen() {

		this.widget.removeChild(document.querySelector('.widget-wrapper-cover'));
		this.widget.removeChild(document.querySelector('.share-block'));
	}

}

class Map {

	constructor() {

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

		document.getElementsByClassName('widget')[0].appendChild(this.mapScreen);
		document.getElementById('YMapsID').style.height = window.screen.height / 2 + 'px';

		ymaps.ready(this.initMap.bind(this));
		document.querySelector('.location-search-btn').addEventListener('click', this.searchCityByName.bind(this));
		document.querySelector('.location-confirm-btn').addEventListener('click', this.addNewCityToList.bind(this));
	}

	initMap() {

		var geolocation = ymaps.geolocation;
		coords = [ymaps.geolocation.latitude, ymaps.geolocation.longitude];

		myMap = new ymaps.Map('YMapsID', {
			center: coords,
			zoom: 10,
			autoFitToViewport: 'always'
		});
		this.getNewCityDetails();

		document.getElementsByClassName('ymaps-copyrights-pane')[0].style.display = 'none';

		myMap.events.add('click', function (event) {
			coords = event.get('coordPosition');
			this.getNewCityDetails();
		}.bind(this));

		myMap.events.add('boundschange', function (event) {
			if (event.get('newCenter') != event.get('oldCenter')) {
				this.getNewCityDetails();
			}
		}.bind(this));
	}

	stringCoordsToArray(string) {

		var arr = string.split(' ');
		var reverseArr = arr.reverse();
		arrayFromString = reverseArr.map(function (element) {
			return Number(element);
		});
		return arrayFromString;
	}

	getNewCityDetails() {

		var center = myMap.getCenter();
		var newCenter = [center[0].toFixed(6), center[1].toFixed(6)];
		this.coordsToString = newCenter.join(',');

		return fetch('https://geocode-maps.yandex.ru/1.x/?geocode=' + this.coordsToString + '&sco=latlong&kind=locality&format=json').then(function (req) {
			return req.json();
		}).then(function (data) {
			this.cityName = data.response.GeoObjectCollection.featureMember["0"].GeoObject.name;
			document.getElementsByClassName('location-search')[0].placeholder = this.cityName;
		}.bind(this));
	}

	searchCityByName() {

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
	}

	addNewCityToList() {

		if (document.getElementsByClassName('location-search')[0].placeholder != document.getElementsByClassName('current-city')[0].innerHTML) {
			eventBus.trigger('add-city', { cityName: this.cityName, coordsToString: this.coordsToString });
		} else {
			document.getElementsByClassName('widget')[0].removeChild(document.getElementsByClassName('location-wrapper-cover')[0]);
		}
	}

}

var Router = function (options) {
	this.routes = options.routes || [];
	this.eventBus = options.eventBus;
	this.init();
};

Router.prototype = {
	init: function () {
		window.addEventListener('hashchange', () => this.handleUrl(window.location.hash));
		this.handleUrl(window.location.hash);
	},
	findPreviousActiveRoute: function () {
		return this.currentRoute;
	},
	findNewActiveRoute: function (url) {
		let route = this.routes.find(routeItem => {
			if (typeof routeItem.match === 'string') {
				return url === routeItem.match;
			} else if (typeof routeItem.match === 'function') {
				return routeItem.match(url);
			} else if (routeItem.match instanceof RegExp) {
				return url.match(routeItem.match);
			}
		});

		return route;
	},
	getRouteParams(route, url) {
		var params = url.match(route.match) || [];
		params.shift();
		return params;
	},
	handleUrl: function (url) {
		url = url.slice(1);
		let previousRoute = this.findPreviousActiveRoute();
		let newRoute = this.findNewActiveRoute(url);

		let routeParams = this.getRouteParams(newRoute, url);

		Promise.resolve().then(() => previousRoute && previousRoute.onLeave && previousRoute.onLeave(...this.currentRouteParams)).then(() => newRoute && newRoute.onBeforeEnter && newRoute.onBeforeEnter(...routeParams)).then(() => newRoute && newRoute.onEnter && newRoute.onEnter(...routeParams)).then(() => {
			this.currentRoute = newRoute;
			this.currentRouteParams = routeParams;
		});
	}
};

/*window.onload = function() {
	location.hash = '';
}*/

screen.orientation.lock('portrait');

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
var wind;
var chartDataMax = [];
var chartDataMin = [];
var chartLabels = [];

function toCelcius(temp) {
	if (localStorage.getItem('temp-unit') == 'F°') {
		return Math.floor(temp);
	} else {
		return Math.floor((temp - 32) / 2 * 11 / 10);
	}
}

function toKilometers(speed) {
	if (localStorage.getItem('wind-unit') == 'миль/ч') {
		return (speed / 0.6213).toFixed(1) + ' миль/ч';
	} else {
		return speed.toFixed(1) + ' км/ч';
	}
}

function iconToDescr(icon) {
	switch (icon) {
		case 'clear-day':
			return 'Ясно';
			break;
		case 'clear-night':
			return 'Ясно';
			break;
		case 'partly-cloudy-day':
			return 'Пасмурно';
			break;
		case 'partly-cloudy-night':
			return 'Пасмурно';
			break;
		case 'cloudy':
			return 'Облачно';
			break;
		case 'rain':
			return 'Дождь';
			break;
		case 'sleet':
			return 'Слякоть';
			break;
		case 'snow':
			return 'Снег';
			break;
		case 'wind':
			return 'Ветрено';
			break;
		case 'fog':
			return 'Туман';
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

function windBearing(num) {
	if (num < 11 || num >= 348) {
		return wind = 'С';
	} else if (num >= 11 && num < 78) {
		return wind = 'СВ';
	} else if (num >= 79 && num < 101) {
		return wind = 'В';
	} else if (num >= 101 && num < 168) {
		return wind = 'ЮВ';
	} else if (num >= 169 && num < 191) {
		return wind = 'Ю';
	} else if (num >= 191 && num < 258) {
		return wind = 'ЮЗ';
	} else if (num >= 158 && num < 281) {
		return wind = 'З';
	} else if (num >= 281 && num < 348) {
		return wind = 'СЗ';
	}
}

class Settings {

	constructor(backHash) {

		document.body.innerHTML = '';
		this.widget = document.createElement('div');
		this.widget.className = 'widget';
		document.body.appendChild(this.widget);

		this.settingsScreen = document.createElement('div');
		this.settingsScreen.className = 'widget-settings-wrapper';

		this.settingsScreen.innerHTML = '\
		<div class="settings-header">\
			<a href="#" class="settings-title js-settings-title"><i class="fa fa-angle-left fa-lg my-settings-angle-left"></i></span>Настройки<span></a>\
			<div class="settings-divider settings-header-divider"></div>\
		</div>\
		<div class="settings-block">\
			<div class="settings-block-title">Оповещения погоды</div>\
			<div class="settings-divider settings-block-divider"></div>\
			<div class="settings-block-body">\
				<div class="settings-block-body-text"></div>\
				<div class="settings-block-body-icon"></div>\
			</div>\
		</div>\
		<div class="settings-block">\
			<div class="settings-block-title">Единица измерения</div>\
			<div class="settings-divider settings-block-divider"></div>\
			<a class="settings-block-body js-temp">\
				<div class="settings-block-body-text">Единицы температуры</div>\
				<div class="settings-block-body-icon"><span class="js-temp-unit"></span><i class="fa fa-angle-right fa-lg my-settings-angle-right"></i></div>\
			</a>\
			<a class="settings-block-body js-wind">\
				<div class="settings-block-body-text">Скорость ветра</div>\
				<div class="settings-block-body-icon"><span class="js-wind-unit"></span><i class="fa fa-angle-right fa-lg my-settings-angle-right"></i></div>\
			</a>\
		</div>';

		this.widget.appendChild(this.settingsScreen);

		this.settingsScreen.getElementsByClassName('js-temp-unit')[0].innerHTML = localStorage.getItem('temp-unit') || 'C°';
		this.settingsScreen.getElementsByClassName('js-wind-unit')[0].innerHTML = localStorage.getItem('wind-unit') || 'км/ч';

		var self = this;

		ymaps.ready(function () {
			self.settingsScreen.getElementsByClassName('settings-block-body-text')[0].innerHTML = ymaps.geolocation.city;
			self.settingsScreen.getElementsByClassName('js-settings-title').href = '#' + ymaps.geolocation.latitude + ',' + ymaps.geolocation.longitude;
		});

		this.settingsScreen.getElementsByClassName('js-wind')[0].addEventListener('click', this.showWindOptionsScreen.bind(this));
		this.settingsScreen.getElementsByClassName('js-temp')[0].addEventListener('click', this.showTempOptionsScreen.bind(this));
		this.settingsScreen.getElementsByClassName('js-settings-title')[0].href = '#today=' + backHash;
	}

	showWindOptionsScreen() {

		var wrapper = document.createElement('div');
		wrapper.className = 'widget-wrapper-cover';
		this.widget.appendChild(wrapper);

		var optionsBlock = document.createElement('div');
		optionsBlock.className = 'options-block';
		optionsBlock.innerHTML = '\
		<a class="option-item">км/ч</a>\
		<div class="option-divider"></div>\
		<a class="option-item">миль/ч</div>';

		this.widget.appendChild(optionsBlock);

		var selectedWindOption = localStorage.getItem('wind-unit') || 'км/ч';

		var items = optionsBlock.getElementsByClassName('option-item');
		for (var i = 0; i < items.length; i++) {
			if (items[i].innerHTML == selectedWindOption) {
				items[i].style.color = '#5cadce';
			}
		}

		optionsBlock.addEventListener('click', this.selectWindOption.bind(this));
	}

	selectWindOption(event) {

		var target = event.target;

		while (target !== document.getElementsByClassName('options-block')[0]) {
			if (target.className == 'option-item') {
				localStorage.setItem('wind-unit', target.innerHTML);
				document.getElementsByClassName('js-wind')[0].children[1].children[0].innerHTML = target.innerHTML;
				this.widget.removeChild(document.getElementsByClassName('widget-wrapper-cover')[0]);
				this.widget.removeChild(document.getElementsByClassName('options-block')[0]);

				return;
			}
			target = target.parentNode;
		}
	}

	showTempOptionsScreen() {

		var wrapper = document.createElement('div');
		wrapper.className = 'widget-wrapper-cover';
		this.widget.appendChild(wrapper);

		var optionsBlock = document.createElement('div');
		optionsBlock.className = 'options-block';
		optionsBlock.innerHTML = '\
		<a class="option-item">C°</a>\
		<div class="option-divider"></div>\
		<a class="option-item">F°</div>';

		this.widget.appendChild(optionsBlock);

		var selectedTempOption = localStorage.getItem('temp-unit') || 'C°';

		var items = optionsBlock.getElementsByClassName('option-item');
		for (var i = 0; i < items.length; i++) {
			if (items[i].innerHTML == selectedTempOption) {
				items[i].style.color = '#5cadce';
			}
		}

		optionsBlock.addEventListener('click', this.selectTempOption.bind(this));
	}

	selectTempOption(event) {

		var target = event.target;

		while (target !== document.getElementsByClassName('options-block')[0]) {
			if (target.className == 'option-item') {
				localStorage.setItem('temp-unit', target.innerHTML);
				document.getElementsByClassName('js-temp')[0].children[1].children[0].innerHTML = target.innerHTML;
				this.widget.removeChild(document.getElementsByClassName('widget-wrapper-cover')[0]);
				this.widget.removeChild(document.getElementsByClassName('options-block')[0]);

				return;
			}
			target = target.parentNode;
		}
	}

}