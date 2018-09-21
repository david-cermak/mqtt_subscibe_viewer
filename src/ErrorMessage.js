import React, { Component } from 'react';

class ErrorMessage extends Component {
    render() {
        return (
            <div>
                <h1>Config was not loaded</h1>
                <p>Please check that <b>mqtt-viewer.json</b> is present in application directory or config path is provided correctly</p>
            </div>
        )
    }
}

export default ErrorMessage