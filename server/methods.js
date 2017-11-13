import { Meteor } from 'meteor/meteor';
import { Game, GameState, gameID, initialGame } from '../imports/api/game';

Meteor.methods({
    start() {
        Game.update({ _id: gameID }, { '$set': { 'startingIn': 10, state: GameState.Starting } });
    },

    pause() {
        Game.update({ _id: gameID }, { '$set': { state: GameState.Paused } });
    },

    resume() {
        Game.update({ _id: gameID }, { '$set': { state: GameState.Running } });
    },

    reset() {
        Game.remove({});
        Game.insert(initialGame());
    }
});