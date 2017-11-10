import { Meteor } from 'meteor/meteor';
import { Game } from '../imports/api/game';

let gameID = null;

Meteor.startup(() => {
    // This is just for testing.
    Game.remove({});

    gameID = Game.insert({
        name: 'This is the name',
        time: {
            secondsLeft: 3821,
            speed: 1,
            isRunning: true
        },
        players: [ 'Logan', 'Mason', 'Ducan' ],
        finalCodes: [
            [ '0', '1', '0', '1', '0' ],
            [ '0', '1', '1', '0', '0' ],
            [ '0', '0', '1', '1', '1' ],
            [ '0', '0', '0', '1', '1' ],
            [ '0', '0', '1', '0', '1' ],
        ],
        hintText: 'Play nice boys'
    });

    Meteor.setInterval(onTick, 1000);
});

function onTick() {
    const game = Game.findOne({_id: gameID});
    if (game.time.isRunning) {
        Game.update({ _id: gameID }, { '$inc': { 'time.secondsLeft': -1 * game.time.speed } });
    }
}