import { Meteor } from 'meteor/meteor';
import { Game } from '../imports/api/game';

Meteor.startup(() => {
    // This is just for testing.
    Game.remove({});

    Game.insert({
        name: 'This is the name',
        secondsLeft: 321,
        players: [ 'Logan', 'Mason', 'Ducan' ],
        finalCodes: [
            [ '0', '1', '0', '1', '0' ],
            [ '0', '1', '1', '0', '0' ],
            [ '0', '0', '1', '1', '1' ],
            [ '0', '0', '0', '1', '1' ],
            [ '0', '0', '1', '0', '1' ],
        ]
    });
});
