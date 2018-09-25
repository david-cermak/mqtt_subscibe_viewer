import React, { Component } from 'react';
import { _ } from 'lodash';
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
    styler
} from "react-timeseries-charts";
import { TimeSeries, TimeRange } from "pondjs";
import { Columns } from 'react-bulma-components/full';
import Gauge from './Gauge';


class TopicCard extends Component {
    constructor(props) {
        super(props)

        this.prepareData = this.prepareData.bind(this);
    }

    lastValue(data) {
        return _.isEmpty(data) ? 0 : _.last(data)[1]
    }

    prepareData() {
        const dataSource = this.props.data.toArray();
        const data = _.isEmpty(dataSource) ? [[Date.now(), 0], [Date.now(), 0]] : dataSource
        return new TimeSeries({
            name: this.props.info.name,
            columns: ["time", "value"],
            points: data
        });
    }

    render() {
        const data = this.prepareData();
        const info = this.props.info;
        const currentValue = this.lastValue(this.props.data.toArray()).toFixed(1);
        const width = this.props.width - 64;
        const height = info.boolean ? 50 : Math.round(Math.max(this.props.height - 100, 160));



        return info.boolean ?
            <h1 className="title is-2" style={{ height: `${height}px` }}>
                {Math.round(currentValue) ? (info.trueMessage || "True") : (info.falseMessage || "False")}
            </h1 > :
            <Columns>
                <Columns.Column>
                    <Gauge value={currentValue}
                        label={info.name}
                        min={info.min} max={info.max}
                        symbol={info.unit} height={height} width={width / 12 * 3} />
                </Columns.Column>
                <Columns.Column>
                    <ChartContainer
                        timeRange={new TimeRange([Date.now() - (info.plot_history || 600000), Date.now()])}
                        width={width / 12 * 8}
                        timeAxisTickCount={2}
                        style={
                            {
                                label: {
                                    stroke: "none",
                                    fill: "#363636",
                                    fontWeight: 100,
                                    fontSize: 12
                                },
                                values: {
                                    stroke: "none",
                                    fill: "#363636",
                                    fontWeight: 100,
                                    fontSize: 11
                                },
                                ticks: { fill: "none", stroke: "#f5f5f5" },
                                axis: { fill: "none", stroke: "transparent" }
                            }
                        }>
                        <ChartRow height={height}>
                            <YAxis
                                id="axis1"
                                label=""
                                min={info.min}
                                max={info.max}
                                width="30"
                                type={info.type || "linear"}
                                format=".0f"
                                tickCount={5}
                                showGrid={true}
                                style={
                                    {
                                        label: {
                                            stroke: "none",
                                            fill: "#363636",
                                            fontWeight: 100,
                                            fontSize: 12
                                        },
                                        values: {
                                            stroke: "none",
                                            fill: "#363636",
                                            fontWeight: 100,
                                            fontSize: 11,
                                        },
                                        ticks: { fill: "none", stroke: "#f5f5f5" },
                                        axis: { fill: "none", stroke: "transparent" }
                                    }}
                            />
                            <Charts>
                                <LineChart
                                    axis="axis1"
                                    series={data}
                                    interpolation="curveBasis"
                                    column={["value"]}
                                    style={
                                        styler([
                                            { key: "value", color: "#ff3034", width: 3 }
                                        ])} />
                            </Charts>
                        </ChartRow>
                    </ChartContainer>
                </Columns.Column>
            </Columns >;
    }
}

export default TopicCard;