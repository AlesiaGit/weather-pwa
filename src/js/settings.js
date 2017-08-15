var Settings = function(backHash) {

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

	ymaps.ready(function() {
		self.settingsScreen.getElementsByClassName('settings-block-body-text')[0].innerHTML = ymaps.geolocation.city;
		self.settingsScreen.getElementsByClassName('js-settings-title').href = '#' + ymaps.geolocation.latitude + ',' + ymaps.geolocation.longitude;
	});

	


	this.showWindOptionsScreen = function() {
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

	};



	this.selectWindOption = function(event) {
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
	};



	this.showTempOptionsScreen = function() {
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

	};



	this.selectTempOption = function(event) {
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
	};


	this.settingsScreen.getElementsByClassName('js-wind')[0].addEventListener('click', this.showWindOptionsScreen.bind(this));
	this.settingsScreen.getElementsByClassName('js-temp')[0].addEventListener('click', this.showTempOptionsScreen.bind(this));
	this.settingsScreen.getElementsByClassName('js-settings-title')[0].href = '#today=' + backHash;

}


