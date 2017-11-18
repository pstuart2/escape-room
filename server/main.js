import { Meteor } from 'meteor/meteor';
import { Game, GameState, getQuestionReward } from '../imports/api/game';
import { HTTP } from 'meteor/http'

const ApiServer = "http://localhost:8080";

let timerId = null;
let runningGameId = null;

Meteor.startup( () => {
    if ( timerId ) {
        Meteor.clearInterval( timerId );
    }

    // TODO: Create settings collection (single row) for ApiServer url
    // TODO: Api server can access it also, then global settings can be shared


    let runningGame = Game.findOne( { state: { '$nin': [ GameState.Finished, GameState.Pending ] } } );
    if ( runningGame ) {
        runningGameId = runningGame._id;
        startTimer();
    }
} );

Meteor.publish( 'games', () => {
    return Game.find();
} );

Meteor.publish( 'game', ( _id ) => {
    return Game.find( { _id } );
} );

Meteor.publish( 'questions', () => {
    return Game.find(
        { _id: runningGameId },
        {
            fields: { _id: 1, 'questions.q': 1, 'questions.h': 1, 'questions.r': 1 }
        }
    );
} );

Meteor.methods( {
    lightsOn( _id ) {
        HTTP.post( `${ApiServer}/state`, { data: { 'id': _id, 'state': 'lightsOn' } } );
    },

    lightsOff( _id ) {
        HTTP.post( `${ApiServer}/state`, { data: { 'id': _id, 'state': 'lightsOff' } } );
    },

    wallLightsOnly( _id ) {
        HTTP.post( `${ApiServer}/state`, { data: { 'id': _id, 'state': 'wallLightsOnly' } } );
    },

    gameRoomLightsOnly( _id ) {
        HTTP.post( `${ApiServer}/state`, { data: { 'id': _id, 'state': 'gameRoomLightsOnly' } } );
    },

    start( _id ) {
        if ( runningGameId ) {
            return;
        }

        runningGameId = _id;

        HTTP.post( `${ApiServer}/state`, { data: { 'id': _id, 'state': 'starting' } } );
        Game.update( { _id }, { '$set': { 'startingIn': 10, state: GameState.Starting } } );

        startTimer();
    },

    pause( _id ) {
        HTTP.post( `${ApiServer}/state`, { data: { 'id': _id, 'state': 'pause' } }, () => {
        } );
        Meteor.clearInterval( timerId );
    },

    resume( _id ) {
        HTTP.post( `${ApiServer}/state`, { data: { 'id': _id, 'state': 'resume' } }, () => {
        } );
        startTimer();
    },

    finish( _id ) {
        Meteor.clearInterval( timerId );
        HTTP.post( `${ApiServer}/state`, { data: { 'id': _id, 'state': 'finish' } }, () => {
        } );

        runningGameId = null;
    },

    answer( index, answer ) {
        const game = Game.findOne( { _id: runningGameId }, { fields: { questions: 1 } } );
        console.log( `${index} - ${answer} [${game.questions[ index ].a}]` );

        if ( game.questions[ index ].a.toLowerCase() === answer.toLowerCase() ) {
            HTTP.post( `${ApiServer}/answer`, { data: { 'result': 'correct' } } );

            const key = `questions.${index}.r`;
            const setValue = {};
            setValue[ key ] = getQuestionReward( index );

            Game.update( { _id: runningGameId }, { '$set': setValue, '$inc': { questionAttempts: 1 } } );
            return true;
        }

        HTTP.post( `${ApiServer}/answer`, { data: { 'result': 'wrong' } } );
        Game.update( { _id: runningGameId }, { '$inc': { questionAttempts: 1 } } );
        return false;
    }
} );

function startTimer() {
    timerId = Meteor.setInterval( onTick, 1000 );
}


function onTick() {
    const game = Game.findOne( { _id: runningGameId } );

    switch ( game.state ) {
        case GameState.Starting:
            starting( game );
            break;

        case GameState.Running:
            running( game );
            break;

        case GameState.Paused:
            paused( game );
            break;
    }
}

function starting( game ) {
    if ( game.startingIn === 1 ) {
        HTTP.post( `${ApiServer}/state`, { data: { 'state': 'start' } } );
        Game.update( { _id: game._id }, { '$set': { 'startingIn': 0, state: GameState.Running } } );
        return;
    }

    Game.update( { _id: game._id }, { '$inc': { 'startingIn': -1 } } );
}

function running( game ) {
    Game.update( { _id: game._id }, { '$inc': { 'time.seconds': game.time.speed } } );
}

function paused( game ) {
    Game.update( { _id: game._id }, { '$inc': { secondsPaused: 1 } } );
}
