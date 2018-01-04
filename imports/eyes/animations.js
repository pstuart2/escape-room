import {
    createHideFaceLeft, createHideFaceRight, createLookDown, createLookLeft, createLookRight, createLookUp,
    createReturnFromDown, createReturnFromLeft, createReturnFromRight, createReturnFromSurprised, createReturnFromUp,
    createRollEyes, createShakeNo, createShakeYes, createSurprised, createUnhideFaceLeft, createUnhideFaceRight,
} from './animationCreators';

let rightEye,
    leftEye,
    rightBrow,
    leftBrow,
    camera;

export const EyeState = {
    NORMAL: 0,
    EYES_DOWN: 1,
    EYES_R_DOWN: 2,
    EYES_UP: 3,
    EYES_R_UP: 4,
    EYES_RIGHT: 5,
    EYES_R_RIGHT: 6,
    EYES_LEFT: 7,
    EYES_R_LEFT: 8,
    EYES_ROLL: 9,
    EYES_SURPRISED: 10,
    EYES_R_SURPRISED: 11,
    HIDE_LEFT: 12,
    HIDE_LEFT_R: 13,
    HIDE_RIGHT: 14,
    HIDE_RIGHT_R: 15,
    YES: 16,
    NO: 17
};

const animations = [];

export function setUpAnimations( scene ) {
    rightEye = scene.getMeshByName( 'Eye.R' );
    leftEye = scene.getMeshByName( 'Eye.L' );
    rightBrow = scene.getMeshByName( 'Brow.R' );
    leftBrow = scene.getMeshByName( 'Brow.L' );
    camera = scene.activeCamera;

    animations[ EyeState.EYES_DOWN ] = createLookDown( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.EYES_R_DOWN ] = createReturnFromDown( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.EYES_UP ] = createLookUp( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.EYES_R_UP ] = createReturnFromUp( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.EYES_RIGHT ] = createLookRight( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.EYES_R_RIGHT ] = createReturnFromRight( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.EYES_LEFT ] = createLookLeft( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.EYES_R_LEFT ] = createReturnFromLeft( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.EYES_ROLL ] = createRollEyes( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.EYES_SURPRISED ] = createSurprised( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.EYES_R_SURPRISED ] = createReturnFromSurprised( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EyeState.HIDE_LEFT ] = createHideFaceLeft( camera );
    animations[ EyeState.HIDE_LEFT_R ] = createUnhideFaceLeft( camera );
    animations[ EyeState.HIDE_RIGHT ] = createHideFaceRight( camera );
    animations[ EyeState.HIDE_RIGHT_R ] = createUnhideFaceRight( camera );
    animations[ EyeState.YES ] = createShakeYes( camera );
    animations[ EyeState.NO ] = createShakeNo( camera );
}

export function lookDown( scene, onEnd ) {
    animate( scene, EyeState.EYES_DOWN, onEnd );
}

export function returnFromDown( scene, onEnd ) {
    animate( scene, EyeState.EYES_R_DOWN, onEnd );
}

export function lookUp( scene, onEnd ) {
    animate( scene, EyeState.EYES_UP, onEnd );
}

export function returnFromUp( scene, onEnd ) {
    animate( scene, EyeState.EYES_R_UP, onEnd );
}

export function lookRight( scene, onEnd ) {
    animate( scene, EyeState.EYES_RIGHT, onEnd );
}

export function returnFromRight( scene, onEnd ) {
    animate( scene, EyeState.EYES_R_RIGHT, onEnd );
}

export function lookLeft( scene, onEnd ) {
    animate( scene, EyeState.EYES_LEFT, onEnd );
}

export function returnFromLeft( scene, onEnd ) {
    animate( scene, EyeState.EYES_R_LEFT, onEnd );
}

export function rollEyes( scene, onEnd ) {
    animate( scene, EyeState.EYES_ROLL, onEnd );
}

export function surprised( scene, onEnd ) {
    animate( scene, EyeState.EYES_SURPRISED, onEnd );
}

export function returnFromSurprised( scene, onEnd ) {
    animate( scene, EyeState.EYES_R_SURPRISED, onEnd );
}

export function hideLeft( scene, onEnd ) {
    animate( scene, EyeState.HIDE_LEFT, onEnd );
}

export function unHideFromLeft( scene, onEnd ) {
    animate( scene, EyeState.HIDE_LEFT_R, onEnd );
}

export function hideRight( scene, onEnd ) {
    animate( scene, EyeState.HIDE_RIGHT, onEnd );
}

export function unHideFromRight( scene, onEnd ) {
    animate( scene, EyeState.HIDE_RIGHT_R, onEnd );
}

export function shakeYes( scene, onEnd ) {
    animate( scene, EyeState.YES, onEnd );
}

export function shakeNo( scene, onEnd ) {
    animate( scene, EyeState.NO, onEnd );
}

export function animate( scene, animation, onEnd ) {
    if (!animations[ animation ]) return;

    for ( let i = 0; i < animations[ animation ].length; i++ ) {
        const a = animations[ animation ][ i ];
        if (i === 0) {
            scene.beginDirectAnimation( a.target, [ a.animation ], a.start, a.end, false, 1, onEnd );
        } else {
            scene.beginDirectAnimation( a.target, [ a.animation ], a.start, a.end, false );
        }
    }
}