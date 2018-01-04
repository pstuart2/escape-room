import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setUpAnimations, shakeNo, shakeYes } from '../../eyes/animations';
import {
    Color4,
    Engine,
    SceneLoader
} from 'babylonjs';

export default class Eyes extends Component {

    constructor(props) {
        super(props);
        this.state = { codeIndex: 0 };

        //this.switchCode = this.switchCode.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        console.log('Mounted!');
        this.canvas = document.getElementById('renderCanvas');
        this.engine = new Engine(this.canvas, true);
        renderEyes(this.canvas, this.engine);
    }

    componentWillUnmount() {

    }


    render() {

        return (
            <canvas id="renderCanvas" touch-action="none" />
        );
    }
}

Eyes.propTypes = {
};

function renderEyes(canvas, engine) {
    SceneLoader.Load('/assets/', 'EyeBall.babylon', engine, function (newScene) {

        // Wait for textures and shaders to be ready
        newScene.executeWhenReady(function () {
            setUpAnimations(newScene);

            // Attach camera to canvas inputs
            newScene.activeCamera.attachControl(canvas);

            newScene.autoClear = true;
            newScene.clearColor = hexToColor4('#252524');

            let state = 0;

            setInterval(() => {
                    //console.log(state, newScene.activeCamera.position);

                    switch (state) {
                        case 0:
                            state++;
                            shakeYes(newScene);
                            break;
                        case 1:
                            state = 0;
                            shakeNo(newScene);
                            break;
                    }

                    //console.log(state, newScene.activeCamera.position);
                },
                5000
            );

            // Once the scene is loaded, just register a render loop to render it
            engine.runRenderLoop(function () {
                newScene.render();
            });
        });
    });
}

const hexToColor4 = (hex) => Color4.FromHexString(`${hex}ff`);