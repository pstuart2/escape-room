import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { animate, EyeState, setUpAnimations, shakeNo, shakeYes } from '../../eyes/animations';
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
        renderEyes(this.canvas, this.engine, (scene) => this.scene = scene);
    }

    componentDidUpdate(prevProps) {
        const prevState = prevProps.eyes.state;
        const newState = this.props.eyes.state;

        if (prevState === newState) return;

        const returnState = getReturnState(prevState);

        console.log(`prev: ${prevState}, ret: ${returnState}, new: ${newState}`);
        if (returnState) {
            if (newState === EyeState.NORMAL) {
                animate(this.scene, returnState)
            } else {
                animate(this.scene, returnState, () => animate(this.scene, newState))
            }

        } else {
            animate(this.scene, newState)
        }
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
    eyes: PropTypes.object.isRequired
};

function renderEyes(canvas, engine, setScene) {
    SceneLoader.Load('/assets/', 'EyeBall.babylon', engine, function (newScene) {

        // Wait for textures and shaders to be ready
        newScene.executeWhenReady(function () {
            setUpAnimations(newScene);

            // Attach camera to canvas inputs
            newScene.activeCamera.attachControl(canvas);

            newScene.autoClear = true;
            newScene.clearColor = hexToColor4('#252524');

            setScene(newScene);

            // Once the scene is loaded, just register a render loop to render it
            engine.runRenderLoop(function () {
                newScene.render();
            });
        });
    });
}

function getReturnState(eyeState) {
    switch (eyeState) {
        case EyeState.EYES_DOWN:
            return EyeState.EYES_R_DOWN;

        case EyeState.EYES_UP:
            return EyeState.EYES_R_UP;

        case EyeState.EYES_LEFT:
            return EyeState.EYES_R_LEFT;

        case EyeState.EYES_RIGHT:
            return EyeState.EYES_R_RIGHT;

        case EyeState.EYES_SURPRISED:
            return EyeState.EYES_R_SURPRISED;

        case EyeState.HIDE_LEFT:
            return EyeState.HIDE_LEFT_R;

        case EyeState.HIDE_RIGHT:
            return EyeState.HIDE_RIGHT_R;
    }

    return false;
}

const hexToColor4 = (hex) => Color4.FromHexString(`${hex}ff`);