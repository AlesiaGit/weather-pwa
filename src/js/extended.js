var Extended = function(backHash) {

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

	//document.body.appendChild(this.extendedWrapper);
	this.widget.appendChild(this.extendedWrapper);

	this.ctx = document.getElementById("myChart");
	Chart.defaults.global.defaultFontFamily = 'Mi Lanting';
	Chart.defaults.global.defaultFontSize = 14;
	Chart.defaults.global.defaultFontColor = 'rgba(0,0,0,1)';
	this.ctx.style.width = window.innerWidth*window.devicePixelRatio;
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
				pointBorderWidth: 1,

			},
			{
				label: false,
				data: chartDataMin,
				lineTension: 0,
				backgroundColor: 'rgba(0,0,0,0)',
				borderColor: 'rgba(0,0,0,0.5)',
				borderWidth: 1,
				pointBackgroundColor: 'rgba(255,255,255,1)',
				pointBorderWidth: 1,

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
					display:false
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
				onComplete: function() {
					var ctx = this.chart.ctx;
					ctx.fillStyle = 'rgba(0,0,0,1)';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'bottom';

					this.data.datasets.forEach(function(dataset) {
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
	//document.body.appendChild(this.extendedFooter);
	this.widget.appendChild(this.extendedFooter);

	this.closeExtendedBtn = document.getElementsByClassName('extended-close-btn')[0];
	this.closeExtendedBtn.href = '#today=' + backHash;
	

	lsArray = JSON.parse(localStorage.getItem('cities')) || [];
	lsArray.forEach(function(elem) {
		if (elem['coords'] == backHash) {
			var data = elem['data'];

			document.getElementsByClassName('start-date')[0].innerHTML = toRegDate(data.daily.data[0].time);
			document.getElementsByClassName('end-date')[0].innerHTML = toRegDate(data.daily.data[4].time);
						
			var d = new Date();
			var weekday = d.getDay();
			var weekdaysArray = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
			daysExtended = ["Сегодня", "Завтра", weekdaysArray[(weekday + 2)%7], weekdaysArray[(weekday + 3)%7], weekdaysArray[(weekday + 4)%7]];


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

