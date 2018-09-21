import React, { Component } from 'react';
import { ErrorMessage } from './ErrorMessage';
import { Topic } from './Topic';
import 'bulma/css/bulma.css'
import './App.css';
import { _ } from 'lodash';
import { Columns, Column } from 'react-bulma-components';


// Electron APIs
const electron = window.require('electron');
const remote = electron.remote;
const fs = remote.require('fs');
const mqtt = remote.require('mqtt');


class App extends Component {
  constructor(props) {
    super(props);

    let data = { configFailed: true }

    // Read configs 
    const argv = remote.getGlobal('sharedObject').argv;

    let configPath = "mqtt-monitor.json";
    try {
      data = JSON.parse(fs.readFileSync(configPath));
      data.allTopicsData = {};

      _.forEach(data.devices, (device) => {
        {
          _.forEach(device.topics,
            (topic) => {
              data.allTopicsData[topic.path] = []
            })
        }
      });
    }

    catch (err) {
      console.log(err.message);
    }

    this.state = data;

    // Bind context
    this.renderTopics = this.renderTopics.bind(this);
  }

  componentDidMount() {
    let client = mqtt.connect(this.state.server);
    // Subscribe to topics
    client.on('connect', () => {
      _.forOwn(this.state.allTopicsData, function (data, topic) {
        client.subscribe(topic, function (err) {
          if (!err) {
            console.log(`Subscribed to ${topic}`);
          }
        })
      });
    });

    client.on('message', (topic, message) => {
      const at = Date.now();
      const newValue = parseFloat(message);

      console.log(`Received ${newValue} from ${topic}`);

      const newData = _.cloneDeep(this.state.allTopicsData);
      newData[topic].push([at, newValue]);

      this.setState({ allTopicsData: newData });
    })
  }

  renderTopics(topics, allTopicsData) {
    return _.map(topics, (topicInfo) => {
      const topicData = allTopicsData[topicInfo.path];
      // return <Topic topicData={topicData} key={topicInfo.path} />
      return <Columns.Column key={topicInfo.path}>{`${_.last(topicData[1])}`}</Columns.Column>
    });
  }

  renderDevices(devices, allTopicsData) {
    return _.map(devices, (device) => {
      return <Columns key={device.name}>
        {this.renderTopics(device.topics, allTopicsData)}
      </Columns>
    });
  }


  render() {
    const appContent = this.state.configFailed ?
      <ErrorMessage /> : this.renderDevices(this.state.devices, this.state.allTopicsData);

    return (
      <div>
        {appContent}
      </div>
    );
  }
}

export default App;