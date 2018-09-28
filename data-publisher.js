// Simple script that publishes test data to provided MQTT server. Read settings from `mqtt-config.json` placed next to JS file
const mqtt = require("mqtt");
const fs = require('fs');
const _ = require('lodash');

let configPath = "mqtt-monitor.json";
const config = JSON.parse(fs.readFileSync(configPath));

// Connect 
const client = mqtt.connect(config.server);


// Init values
let values = {};

_.forEach(config.devices, (device) => {
    _.forEach(device.topics, (topic) => {
        const delta = Math.abs((topic.max - topic.min) / 30);
        values[topic.path] =
            {
                current: _.random(topic.min + 5 * delta, topic.max - 5 * delta, true),
                delta: delta
            }
    });
});

function publishData(client) {
    return () => {
        _.forEach(config.devices, (device) => {
            _.forEach(device.topics, (topic) => {
                const delta = values[topic.path].delta;
                const value = topic.boolean ?
                    _.random(0, 1, true) :
                    values[topic.path].current + _.random(-delta, delta, true);

                values[topic.path].current = value;
                console.log(`Publishing ${value} to ${topic.path}`);
                client.publish(topic.path, String(value));
            });
        });
    }
}


client.on('connect', function () {
    console.log(`Connected to ${config.server}`);
    setInterval(publishData(client), 3000);
})
