import { Meteor } from 'meteor/meteor';
import { Game, gameID, GameState, initialGame } from '../imports/api/game';

Meteor.methods({
    start() {
        Game.update({ _id: gameID }, { '$set': { 'startingIn': 10, state: GameState.Starting } });
    },

    pause() {
        Game.update({ _id: gameID }, { '$set': { state: GameState.Paused }, '$inc': { timesPaused: 1 } });
    },

    resume() {
        Game.update({ _id: gameID }, { '$set': { state: GameState.Running } });
    },

    finish() {
        Game.update({ _id: gameID }, { '$set': { state: GameState.Finished } });
    },

    reset() {
        Game.remove({});
        Game.insert(initialGame());
    }
});
