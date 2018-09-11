var Chart = require('chart.js');
let date =  require('date-and-time');
var remote = require('electron').remote,

arguments = remote.getGlobal('sharedObject').prop1;

var mqtt_broker_url = 'mqtt://iot.eclipse.org';
var mqtt_topic = '/topic/my_test/temp';
var topic_unit = 'Temperature'

if (arguments[2]) {
	mqtt_broker_url = arguments[1];
	mqtt_topic = arguments[2];
	topic_unit = arguments[3];
}
	
var ctx = document.getElementById("myChart").getContext('2d');
var ctx2 = document.getElementById("myChart2").getContext('2d');

var line_data =   {
	type: 'line',
	data: {
		labels: ["1", "2", "3", "4", "5", "6"],
		datasets: [{
			label: topic_unit,
			data: [0, 0, 0, 0, 0, 0],
			backgroundColor: [
				'rgba(99, 255, 132, 0.4)',
			],
			borderColor: [
				'rgba(99,255,132,1)',
			],
			borderWidth: 1
		}]
	},
	options: {
		animation: false,
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero:true
				}
			}]
		}
	}
};
var pie_data = {
	datasets: [{
		data: [10, 90],
		backgroundColor: [
				'rgba(54, 235, 55 , 0.5)',
				'rgba(99, 99, 99, 0.3)',
			]
	}],

	labels: [
		topic_unit,
	]
};


let timestamp = new Date();
line_data.data.labels[0] = date.format(timestamp, 'HH:mm:ss');
for (i=1; i<6; i++) {
	timestamp = date.addSeconds(timestamp, 2);
	line_data.data.labels[i] = date.format(timestamp, 'HH:mm:ss');
}
var g_temp = 0;

setInterval(function() {
	let timestamp = new Date();
	line_data.data.labels[0] = date.format(timestamp, 'HH:mm:ss');
	for (i=1; i<6; i++) {
		timestamp = date.addSeconds(timestamp, 2);
		line_data.data.labels[i] = date.format(timestamp, 'HH:mm:ss');
	}

	line_data.data.datasets[0].data.push(g_temp);
	line_data.data.datasets[0].data.shift();
	var myLineChart = new Chart(ctx, line_data);

}, 2000);



var myDoughnutChart = new Chart(ctx2, {
    type: 'doughnut',
    data: pie_data,
    options: {
		animation: false,
    }
});
var myLineChart = new Chart(ctx, line_data);

var mqtt = require('mqtt')
var client  = mqtt.connect(mqtt_broker_url)

client.on('connect', function () {
  client.subscribe(mqtt_topic, function (err) {
    if (!err) {
    }
  })
})

client.on('message', function (topic, message) {
	g_temp = parseInt(message.toString(), 10);

	pie_data.datasets[0].data.push(g_temp)
	pie_data.datasets[0].data.shift()
	pie_data.datasets[0].data.push(100-g_temp)
	pie_data.datasets[0].data.shift()
	var myDoughnutChart = new Chart(ctx2, {
		type: 'doughnut',
		data: pie_data,
		options: {
		animation: false,
		}
	});
})



