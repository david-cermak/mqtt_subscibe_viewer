# mqtt_subscibe_viewer
Simple electron based mqtt client which subscribes a number of selected topics (should send a number) and displays them as a plot for last 10 minutes and gauge with current value

## Development
Make sure that [yarn](https://yarnpkg.com/lang/en/docs/install) installed on your system then run `yarn install` to fetch all dependencies

Run these commands to start dev server and Electron app
``` bash
# Parcel bundles the code and runs dev server
$ yarn dev

# Run the electron app which uses local dev server
$ yarn start-dev
```

Or if you have any application that supports `Procfile` then just run it. [Overmind](https://github.com/DarthSim/overmind) -> `overmind s` or [Foreman](https://github.com/ddollar/foreman) -> `foreman start`


### Production mode and packaging app
Run this command to build production apps for Windows, macOS code in production mode
``` bash
# Create executables
$ yarn dist
```

execute with command line argument pointing to JSON configuration for your app. By default it will try to read configuration from `.mqtt-monitor.json` placed in your home directory (`/Users/user_name/.mqtt-monitor.json` on macOS, `/home/user_name/.mqtt-monitor.json` on Linux and `C:\Users\user_name\.mqtt-monitor.json` on Windows).

Also you can pass config path through command line, for example: `mqtt-monitor.exe path/to/config.json`

Example config:

```json
{
    "server": "mqtt://m2m.eclipse.org:1883",
    "devices": [
        {
            "name": "Device 1",
            "sources": [
                {
                    "path": "/some/temperature",
                    "name": "Temperature",
                    "unit": "°C",
                    "min": -10,
                    "max": 40
                },
            ]
        },
        {
            "name": "Device 2",
            "sources": [
                {
                    "path": "/another/humidity",
                    "name": "Humidity",
                    "unit": "%",
                    "min": 0,
                    "max": 100
                }
            ]
        }
    ]
}
```

![alt text](mqtt-viewer.png)