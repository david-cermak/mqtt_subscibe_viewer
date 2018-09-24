import React, { Component } from 'react';
import Ring from "ringjs";
import { Columns, Container } from 'react-bulma-components/full';
import ErrorMessage from './ErrorMessage';
import TopicCard from './TopicCard';
import 'bulma/css/bulma.css'
import { _ } from 'lodash';

// Electron APIs
const electron = window.require('electron');
const remote = electron.remote;
const fs = remote.require('fs');
const mqtt = remote.require('mqtt');
const currentWindow = remote.getCurrentWindow().removeAllListeners();

class App extends Component {
  constructor(props) {
    super(props);

    let data = { configFailed: true }

    // Read configs 
    const argv = remote.getGlobal('sharedObject').argv;

    // TODO: actually use configs

    let configPath = "mqtt-monitor.json";
    try {
      data = JSON.parse(fs.readFileSync(configPath));
      data.allTopics = [];

      _.forEach(data.devices, (device) => {
        {
          _.forEach(device.topics,
            (topic) => {
              data.allTopics.push(topic.path);
              data[topic.path] = new Ring(300);
            })
        }
      });
    }

    catch (err) {
      console.log(err.message);
    }

    this.state = { ...data, ...this.getWindowSize() };

    // Bind context
    this.renderTopics = this.renderTopics.bind(this);
  }

  componentDidMount() {
    let client = mqtt.connect(this.state.server);
    // Subscribe to topics
    client.on('connect', () => {
      _.forEach(this.state.allTopics, (topic) => {
        client.subscribe(topic, (err) => {
          if (!err) {
            console.log(`Subscribed to ${topic}`);
          }
        })
      });
    });

    client.on('message', (topic, message) => {
      const at = Date.now();

      let updatedState = {};
      this.state[topic].push([at, parseFloat(message)]);
      updatedState[topic] = this.state[topic];
      this.setState(updatedState);
    })

    // Track window size
    currentWindow.on('resize', _.debounce(() => {
      this.setState(this.getWindowSize());
    }, 100));
  }

  getWindowSize() {
    const bounds = remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds();
    return { width: bounds.width, height: bounds.height }
  }

  renderTopics(topics, height) {
    const width = this.state.width / topics.length;

    return _.map(topics, (topicInfo) => {
      return <Columns.Column key={topicInfo.path}>
        <TopicCard data={this.state[topicInfo.path]} height={height} width={width} info={topicInfo} />
      </Columns.Column>
    });
  }

  renderDevices(devices) {
    const height = this.state.height / devices.length;
    return _.map(devices, (device) => {

      return <Columns key={device.name}>
        <Columns.Column size={12} style={{ marginTop: "1em" }}><h1 className="title is-1">{device.name}</h1></Columns.Column>
        {this.renderTopics(device.topics, height)}
      </Columns>
    });
  }


  render() {
    const appContent = this.state.configFailed ?
      <ErrorMessage /> : this.renderDevices(this.state.devices);

    return (
      <Container fluid>
        {appContent}
      </Container>
    );
  }
}

export default App;