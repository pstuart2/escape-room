import { Meteor } from 'meteor/meteor';
import { Game, gameID, GameState, initialGame } from '../imports/api/game';

let timerId = null;
let runningGameId = null;

Meteor.methods({
    start(_id) {
        if (runningGameId) {
            return;
        }

        runningGameId = _id;
        Game.update({ _id }, { '$set': { 'startingIn': 10, state: GameState.Starting } });

        timerId = Meteor.setInterval(onTick, 1000);
    },

    pause() {
        Meteor.clearInterval(timerId);

        Game.update({ _id: runningGameId }, { '$set': { state: GameState.Paused }, '$inc': { timesPaused: 1 } });
    },

    resume() {
        timerId = Meteor.setInterval(onTick, 1000);

        Game.update({ _id: runningGameId }, { '$set': { state: GameState.Running } });
    },

    finish() {
        Meteor.clearInterval(timerId);
        Game.update({ _id: runningGameId }, { '$set': { state: GameState.Finished } });
    }
});


function onTick() {
    const game = Game.findOne({ _id: runningGameId });

    switch ( game.state ) {
        case GameState.Starting:
            starting(game);
            break;

        case GameState.Running:
            running(game);
            break;

        case GameState.Paused:
            paused(game);
            break;
    }
}

function starting(game) {
    if ( game.startingIn === 1 ) {
        Game.update({ _id: game._id }, { '$set': { 'startingIn': 0, state: GameState.Running } });
        return;
    }

    Game.update({ _id: game._id }, { '$inc': { 'startingIn': -1 } });
}

function running(game) {
    Game.update({ _id: game._id }, { '$inc': { 'time.seconds': game.time.speed } });
}

function paused(game) {
    Game.update({ _id: game._id }, { '$inc': { secondsPaused: 1 } });
}