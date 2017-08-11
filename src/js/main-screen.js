var MainScreen = function (coords) {

	//this.widget = widget;
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

	//document.body.appendChild(this.mainScreen);
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

	//document.body.appendChild(this.mainScreenFooter);
	this.widget.appendChild(this.mainScreenFooter);



this.showDropdownList = function () {
	var wrapper = document.createElement('div');
	wrapper.className = 'widget-wrapper-cover';
	//document.body.appendChild(wrapper);
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

	//document.body.appendChild(dropdownList);
	this.widget.appendChild(dropdownList);

	var topCloseBtn = document.querySelector('.dropdown-close');
	topCloseBtn.addEventListener('click', this.closeDropdownList.bind(this));


	document.querySelector('.js-change-location').href = '#change-location';
	document.querySelector('.js-share').addEventListener('click', this.showShareScreen.bind(this));
	document.querySelector('.js-settings').href =  '#settings=' + window.location.hash.split('=').pop();
};


this.closeDropdownList = function() {
	this.widget.removeChild(document.querySelector('.widget-wrapper-cover'));
	this.widget.removeChild(document.querySelector('.dropdown-list'));
};


this.getMainPageWeatherData = function() {
	var coords = this.coords;
	//console.log(coords);
	if(!coords) return;
	return fetch('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/14b2f0cd9db914c3bbf4ab5e43ac514d/' + coords).then(function (req) {
		return req.json();
	}).then(function (data) {

		var d = new Date();
		var weekday = d.getDay();
		var weekdaysArray = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
		days = ["Сегодня", "Завтра", weekdaysArray[(weekday + 2)%7]];

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
		lsArray.forEach(function(elem) {
			if (elem['coords'] == coords) {
				elem['data'] = data;
				document.querySelector('.top-city').innerHTML = elem['city'];
				//console.log(elem['city']);
				this.coordsToString = elem['coords'];
				this.cityName = elem['city'];
			}
		});
		localStorage.setItem('cities', JSON.stringify(lsArray));


	}.bind(this));
};



this.setMainPageInnerHTML = function() {
	if (window.location.hash == '') {
		ymaps.ready(function() {
			cityName = ymaps.geolocation.city;
			coordsToString = ymaps.geolocation.latitude + ',' + ymaps.geolocation.longitude;

			document.getElementsByClassName('top-city')[0].innerHTML = cityName;
			document.querySelector('.bottom-link-style').href = '#extended=' + coordsToString;
			document.querySelector('.more-info').href = 'https://darksky.net/forecast/' + coordsToString + '/si24/en';
			window.location.hash = '#today=' + coordsToString;
			
			lsArray = JSON.parse(localStorage.getItem('cities')) || [];
			lsArray.forEach(function(elem) {
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
			coordsToString = location.hash.split('=').pop()
			document.querySelector('.bottom-link-style').href = '#extended=' + coordsToString;
			document.querySelector('.more-info').href = 'https://darksky.net/forecast/' + coordsToString + '/si24/en';
			this.getMainPageWeatherData(coordsToString);
	}
};



	this.showShareScreen = function() {
		this.closeDropdownList();

		var wrapper = document.createElement('div');
		wrapper.className = 'widget-wrapper-cover';
		this.widget.appendChild(wrapper);


		var shareBlock = document.createElement('div');
		shareBlock.className = 'share-block';
		shareBlock.innerHTML = '\
		<div class="share-title">Поделиться</div>\
		<div class="share-icons">\
			<a href="" class="ssk ssk-lg ssk-rounded ssk-tumblr share-item"></a>\
			<a href="" class="ssk ssk-lg ssk-rounded ssk-pinterest share-item"></a>\
			<a href="" class="ssk ssk-lg ssk-rounded ssk-vk share-item"></a>\
			<a href="" class="ssk ssk-lg ssk-rounded ssk-google-plus share-item"></a>\
		</div>\
		<div class="share-divider"></div>\
		<a href="" class="share-cancel-btn">Отмена</a>';

		this.widget.appendChild(shareBlock);

		SocialShareKit.init({
		    selector: '.ssk',
		    url: '',
		    text: 'Here is weather from my weather widget',
		});

		var links = document.getElementsByClassName('ssk');
		for (var i = 0; i < links.length; i++) {
			links[i].addEventListener('click', this.hideShareScreen.bind(this));
		
		}
		
		document.getElementsByClassName('share-cancel-btn')[0].addEventListener('click', this.hideShareScreen.bind(this));
	};


	
	this.hideShareScreen = function() {
		this.widget.removeChild(document.querySelector('.widget-wrapper-cover'));
		this.widget.removeChild(document.querySelector('.share-block'));
	};



	this.setMainPageInnerHTML();

	document.querySelector('.top-dropdown').addEventListener('click', this.showDropdownList.bind(this));
}



