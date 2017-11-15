import { Meteor } from 'meteor/meteor';
import { Game, GameState, getQuestionReward } from '../imports/api/game';

let timerId = null;
let runningGameId = null;

Meteor.startup(() => {
    if ( timerId ) {
        Meteor.clearInterval(timerId);
    }


    let runningGame = Game.findOne({ state: { '$nin': [ GameState.Finished, GameState.Pending ] } });
    if ( runningGame ) {
        runningGameId = runningGame._id;
        startTimer();
    }
});

Meteor.publish('games', () => {
    return Game.find();
});

Meteor.publish('game', (_id) => {
    return Game.find({ _id });
});

Meteor.publish('questions', () => {
    return Game.find(
        { _id: runningGameId },
        {
            fields: { _id: 1, 'questions.q': 1, 'questions.h': 1, 'questions.r': 1 }
        }
    );
});

Meteor.methods({
    start(_id) {
        if ( runningGameId ) {
            return;
        }

        runningGameId = _id;
        Game.update({ _id }, { '$set': { 'startingIn': 10, state: GameState.Starting } });

        startTimer();
    },

    pause() {
        Meteor.clearInterval(timerId);

        Game.update({ _id: runningGameId }, { '$set': { state: GameState.Paused }, '$inc': { timesPaused: 1 } });
    },

    resume() {
        startTimer();

        Game.update({ _id: runningGameId }, { '$set': { state: GameState.Running } });
    },

    finish() {
        Meteor.clearInterval(timerId);
        Game.update({ _id: runningGameId }, { '$set': { state: GameState.Finished } });

        runningGameId = null;
    },

    answer(index, answer) {
        const game = Game.findOne({ _id: runningGameId }, { fields: { questions: 1 } });
        console.log(`${index} - ${answer} [${game.questions[ index ].a}]`);

        if ( game.questions[ index ].a.toLowerCase() === answer.toLowerCase() ) {
            console.log('Correct');

            const key = `questions.${index}.r`;
            const setValue = {};
            setValue[ key ] = getQuestionReward(index);

            Game.update({ _id: runningGameId }, { '$set': setValue, '$inc': { questionAttempts: 1 } });
            return true;
        }

        Game.update({ _id: runningGameId }, { '$inc': { questionAttempts: 1 } });
        return false;
    }
});

function startTimer() {
    timerId = Meteor.setInterval(onTick, 1000);
}


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