# mqtt_subscibe_viewer
Simple electron based mqtt client which subscribes a number of selected topics (should send a number) and displays them as chart for last hour and gauge with current value

## Development
Make sure that [yarn](https://yarnpkg.com/lang/en/docs/install) installed on your system then run `yarn install` to fetch all dependencies

Run these commands to start dev server and Electron app
``` bash
# Parcel bundles the code and runs dev server
$ yarn dev

# Run the electron app which uses local dev server
$ yarn start-dev
```

Or if you have any application that supports `Procfile` then just run it. [Overmind](https://github.com/DarthSim/overmind) or [Foreman](https://github.com/ddollar/foreman)


### Production mode and packaging app
Run this command to bundle code in production mode
``` bash
# Parcel bundle code once
$ yarn build

# Create executables
$ yarn dist
```

execute with command line argument pointing to JSON configuration for your app. By default it will try to read configuration from `mqtt-monitor.json` placed next to the application.
for example: `mqtt-monitor.exe path/to/config.json`

Example config:

```json
{
    "server": "mqtt://iot.eclipse.org",
    "topics": [
        {
            "path": "/topic/my_test/temp",
            "name": "Temperature",
            "unit": "°C",
            "min": -10,
            "max": 40
        }
    ]
}
```

![alt text](mqtt_mon.png)