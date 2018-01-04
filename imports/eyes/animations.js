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

export const
    NOMAL = 0,
    EYES_DOWN = 1,
    EYES_R_DOWN = 2,
    EYES_UP = 3,
    EYES_R_UP = 4,
    EYES_RIGHT = 5,
    EYES_R_RIGHT = 6,
    EYES_LEFT = 7,
    EYES_R_LEFT = 8,
    EYES_ROLL = 9,
    SURPRISED = 10,
    SURPRISED_R = 11,
    HIDE_LEFT = 12,
    HIDE_LEFT_R = 13,
    HIDE_RIGHT = 14,
    HIDE_RIGHT_R = 15,
    YES = 16,
    NO = 17;

const animations = [];

export function setUpAnimations( scene ) {
    rightEye = scene.getMeshByName( 'Eye.R' );
    leftEye = scene.getMeshByName( 'Eye.L' );
    rightBrow = scene.getMeshByName( 'Brow.R' );
    leftBrow = scene.getMeshByName( 'Brow.L' );
    camera = scene.activeCamera;

    animations[ EYES_DOWN ] = createLookDown( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EYES_R_DOWN ] = createReturnFromDown( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EYES_UP ] = createLookUp( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EYES_R_UP ] = createReturnFromUp( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EYES_RIGHT ] = createLookRight( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EYES_R_RIGHT ] = createReturnFromRight( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EYES_LEFT ] = createLookLeft( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EYES_R_LEFT ] = createReturnFromLeft( rightEye, leftEye, rightBrow, leftBrow );
    animations[ EYES_ROLL ] = createRollEyes( rightEye, leftEye, rightBrow, leftBrow );
    animations[ SURPRISED ] = createSurprised( rightEye, leftEye, rightBrow, leftBrow );
    animations[ SURPRISED_R ] = createReturnFromSurprised( rightEye, leftEye, rightBrow, leftBrow );
    animations[ HIDE_LEFT ] = createHideFaceLeft( camera );
    animations[ HIDE_LEFT_R ] = createUnhideFaceLeft( camera );
    animations[ HIDE_RIGHT ] = createHideFaceRight( camera );
    animations[ HIDE_RIGHT_R ] = createUnhideFaceRight( camera );
    animations[ YES ] = createShakeYes( camera );
    animations[ NO ] = createShakeNo( camera );
}

export function lookDown( scene ) {
    animate( scene, EYES_DOWN );
}

export function returnFromDown( scene ) {
    animate( scene, EYES_R_DOWN );
}

export function lookUp( scene ) {
    animate( scene, EYES_UP );
}

export function returnFromUp( scene ) {
    animate( scene, EYES_R_UP );
}

export function lookRight( scene ) {
    animate( scene, EYES_RIGHT );
}

export function returnFromRight( scene ) {
    animate( scene, EYES_R_RIGHT );
}

export function lookLeft( scene ) {
    animate( scene, EYES_LEFT );
}

export function returnFromLeft( scene ) {
    animate( scene, EYES_R_LEFT );
}

export function rollEyes( scene ) {
    animate( scene, EYES_ROLL );
}

export function surprised( scene ) {
    animate( scene, SURPRISED );
}

export function returnFromSurprised( scene ) {
    animate( scene, SURPRISED_R );
}

export function hideLeft( scene ) {
    animate( scene, HIDE_LEFT );
}

export function unHideFromLeft( scene ) {
    animate( scene, HIDE_LEFT_R );
}

export function hideRight( scene ) {
    animate( scene, HIDE_RIGHT );
}

export function unHideFromRight( scene ) {
    animate( scene, HIDE_RIGHT_R );
}

export function shakeYes( scene ) {
    animate( scene, YES );
}

export function shakeNo( scene ) {
    animate( scene, NO );
}

function animate( scene, animation ) {
    for ( let i = 0; i < animations[ animation ].length; i++ ) {
        const a = animations[ animation ][ i ];
        scene.beginDirectAnimation( a.target, [ a.animation ], a.start, a.end, false );
    }
}