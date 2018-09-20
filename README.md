# mqtt_subscibe_viewer
Simple electron based mqtt client which subscribes a number of selected topics (should send a number) and displays them as chart for last hour and gauge with current value

## Development
Make sure that [yarn](https://yarnpkg.com/lang/en/docs/install) installed on your system then run `yarn install` to fetch all dependencies

Run `yarn start` to start the app 

## Example of creating distribution file for current OS
Just run `yarn dist`

execute with command line arguments [mqtt_broker_url] [mqtt_topic_to_subscribe] [units of topic]
for example:
`mqtt-monitor.exe mqtt://iot.eclipse.org /topic/my_test/temp Temperature`

![alt text](mqtt_mon.png)