import React from 'react';
import { WebGazeContext } from './WebGazeContext';
import MainApp from './Main';

import './App.css';


import Script from 'react-load-script'
declare var GazeCloudAPI;

class GazeCloudAPILoader extends React.Component {
    constructor() {
        super();
        this.state = {
            context: { x: -1, y: -1 }
        };
    }

    handleScriptLoad() {

        function processGaze(GazeData) {
            var x_ = GazeData.docX;
            var y_ = GazeData.docY;
            document.getElementById("gazeX").innerHTML = x_;//GazeData.GazeX;
            document.getElementById("gazeY").innerHTML = y_;//GazeData.GazeY;

            this.setState({ context: { x: x_, y: y_ } });

            var gaze = document.getElementById("gaze");
            x_ -= gaze.clientWidth / 2;
            y_ -= gaze.clientHeight / 2;

            // console.log(x_, y_);

            gaze.style.left = x_ + "px";
            gaze.style.top = y_ + "px";

            if (GazeData.state !== 0) {
                if (gaze.style.display === 'block')
                    gaze.style.display = 'none';
            } else {
                if (gaze.style.display === 'none')
                    gaze.style.display = 'block';
            }


        }
        GazeCloudAPI.OnCalibrationComplete = function () {
            console.log('gaze Calibration Complete');
        }
        GazeCloudAPI.OnCamDenied = function () { console.log('camera access denied') }
        GazeCloudAPI.OnError = function (msg) { console.log('err: ' + msg) }
        GazeCloudAPI.UseClickRecalibration = true;
        GazeCloudAPI.OnResult = processGaze.bind(this);

    }

    handleScriptError() {
        console.log('Script loading Error!');
    }

    render() {
        return (
            <WebGazeContext.Provider value={this.state.context}>
                <Script
                    url="https://api.gazerecorder.com/GazeCloudAPI.js"
                    onLoad={this.handleScriptLoad.bind(this)}
                    onError={this.handleScriptError.bind(this)}
                />
                <button onClick={() => GazeCloudAPI.StartEyeTracking()}> Calibrate </button>
                <button onClick={() => GazeCloudAPI.StopEyeTracking()}> Stop Tracking </button>
                <MainApp />
            </WebGazeContext.Provider>

        );
    }
}
GazeCloudAPILoader.contextType = WebGazeContext;

function App() {
    return (
        <div className="App">
            <GazeCloudAPILoader />
        </div>
    );
}

export default App;