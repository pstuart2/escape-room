import { Meteor } from 'meteor/meteor';
import { Game, GameState, initialGame } from '../imports/api/game';

let gameID = null;

Meteor.startup(() => {
    // This is just for testing.
    Game.remove({});

    gameID = Game.insert(initialGame());

    Meteor.setInterval(onTick, 1000);
});

function onTick() {
    const game = Game.findOne({ _id: gameID });

    switch ( game.state ) {
        case GameState.Starting:
            starting(game);
            break;

        case GameState.Running:
            running(game);
            break;
    }
}

function starting(game) {
    if ( game.startingIn === 1 ) {
        Game.update({ _id: gameID }, { '$set': { 'startingIn': 0, state: GameState.Running } });
        return;
    }

    Game.update({ _id: gameID }, { '$inc': { 'startingIn': -1 } });
}

function running(game) {
    Game.update({ _id: gameID }, { '$inc': { 'time.secondsLeft': -1 * game.time.speed } });

    if ( game.time.secondsLeft === 1 ) {
        Game.update({ _id: gameID }, { '$set': { state: GameState.Finished } });
    }
}
