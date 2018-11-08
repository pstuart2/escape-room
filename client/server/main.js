import { Meteor } from 'meteor/meteor';
import {Games} from '../imports/api/games';

Meteor.startup(() => {

});

Meteor.publish('gameList', function () {
    return Games.find({}, {
        fields: { _id: 1, name: 1, createdAt: 1 }
    });
});
