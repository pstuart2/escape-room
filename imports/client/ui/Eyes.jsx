import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { animate, EyeState, setUpAnimations } from '../../eyes/animations';
import { Color4, Engine, SceneLoader } from 'babylonjs';
import { EyesInteractState, Game } from '../../api/game';


// TODO: come out when no face for 10 seconds
// TODO: hide when there is a face


export default class Eyes extends Component {

    constructor( props ) {
        super( props );
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.canvas = document.getElementById( 'renderCanvas' );
        this.engine = new Engine( this.canvas, true );
        renderEyes( this.canvas, this.engine, ( scene ) => {
            this.scene = scene;
            handleInteractStateChange( this.props.gameId, this.props.eyes, { interact: -1, state: getRandomHideDirection() }, this.scene );
        } );
    }

    componentDidUpdate( prevProps ) {
        handleInteractStateChange( this.props.gameId, this.props.eyes, prevProps.eyes, this.scene );
        handleEyeStateChange( this.props.gameId, this.props.eyes, prevProps.eyes, this.scene );
    }

    componentWillUnmount() {

    }


    render() {

        return (
            <canvas id="renderCanvas" touch-action="none"/>
        );
    }
}

Eyes.propTypes = {
    eyes: PropTypes.object.isRequired,
    gameId: PropTypes.string.isRequired
};

function renderEyes( canvas, engine, setScene ) {
    SceneLoader.Load( '/assets/', 'EyeBall.babylon', engine, function( newScene ) {

        // Wait for textures and shaders to be ready
        newScene.executeWhenReady( function() {
            setUpAnimations( newScene );

            // Attach camera to canvas inputs
            newScene.activeCamera.attachControl( canvas );

            newScene.autoClear = true;
            setEyesVisibleColor( newScene );

            setScene( newScene );

            // Once the scene is loaded, just register a render loop to render it
            engine.runRenderLoop( function() {
                newScene.render();
            } );
        } );
    } );
}

function getReturnState( eyeState ) {
    switch ( eyeState ) {
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

let eyesWaitingTimer = null;

function handleInteractStateChange( gameId, eyes, prevEyes, scene ) {
    const prevState = prevEyes.interact;
    const newState = eyes.interact;

    if ( prevState === EyesInteractState.Found ) return;
    if ( prevState === newState ) return;

    if ( newState === EyesInteractState.Found ) {
        setEyesVisibleColor( scene );
        const returnAnimation = getReturnState( prevEyes.state );
        animate( scene, returnAnimation );
        return;
    } else if ( newState === EyesInteractState.Hiding ) {
        Game.update( { _id: gameId }, { '$set': { 'eyes.state': getRandomHideDirection() } } );
        setHiddenEyesColor( scene );
        if ( eyesWaitingTimer ) clearTimeout( eyesWaitingTimer );
        eyesWaitingTimer = null;
        return;
    }

    switch ( prevState ) {
        case EyesInteractState.Hiding:
            if ( newState === EyesInteractState.Waiting ) {
                eyesWaitingTimer = setTimeout( function() {
                    Game.update( { _id: gameId }, { '$set': { 'eyes.interact': EyesInteractState.Peeking } } )
                }, 5000 )
            }
            break;

        case EyesInteractState.Waiting:
            if ( newState === EyesInteractState.Peeking ) {
                setEyesVisibleColor( scene );
                Game.update( { _id: gameId }, { '$set': { 'eyes.state': EyeState.NORMAL } } );
            }
            break;
    }
}

function handleEyeStateChange( gameId, eyes, prevEyes, scene ) {
    const prevState = prevEyes.state;
    const newState = eyes.state;

    if ( prevState === newState ) return;

    const returnState = getReturnState( prevState );

    if ( returnState ) {
        if ( newState === EyeState.NORMAL ) {
            animate( scene, returnState )
        } else {
            animate( scene, returnState, () => animate( scene, newState ) )
        }

    } else {
        animate( scene, newState )
    }
}

function setEyesVisibleColor( scene ) {
    scene.clearColor = hexToColor4( '#252524' );
}

function setHiddenEyesColor( scene ) {
    scene.clearColor = hexToColor4( '#000000' );
}

const randomNumberBetween0and1 = Math.floor( Math.random() * 2 );

function getRandomHideDirection() {
    if ( randomNumberBetween0and1 === 0 ) {
        return EyeState.HIDE_LEFT;
    }

    return EyeState.HIDE_RIGHT;
}

const hexToColor4 = ( hex ) => Color4.FromHexString( `${hex}ff` );