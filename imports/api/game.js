import { Mongo } from 'meteor/mongo';
import { EyeState } from '../eyes/animations';
import moment from 'moment';

export const Game = new Mongo.Collection( 'game' );

export const GameState = {
    Pending: 0,
    Starting: 1,
    Running: 2,
    Paused: 3,
    Finished: 4
};

export const EyesInteractState = {
    Hiding: 0,
    Waiting: 1,
    Peeking: 2,
    Found: 3,
    AfraidOfDark: 4,
};

export const ListeningState = {
    None: 0,
    Listening: 1,
    Fetching: 2,
    Success: 3,
    Failed: 4,
};

export const getGameStateString = ( gameState ) => {
    switch ( gameState ) {
        case GameState.Pending:
            return 'Pending';
        case GameState.Starting:
            return 'Starting';
        case GameState.Running:
            return 'Running';
        case GameState.Paused:
            return 'Paused';
        case GameState.Finished:
            return 'Finished';
    }

    return 'Unknown';
};


export function initialGame( name ) {
    return {
        name,
        createdAt: new Date(),
        state: GameState.Pending,
        startingIn: 30,
        time: {
            seconds: 0,
            speed: 1,
            current: moment().toDate(),
            clock: {
                hour: 0,
                min: 0
            }
        },
        instructions: 'As new teenagers, you will be expected to have more responsibilities. Because of that you will need to learn how to manager your time better. One trick is to always set your clocks ahead by a few minutes. So be sure to keep your clock set ahead. Do not set it further than *5 minutes* ahead though. We wouldn\'t want to be TOO crazy!',
        players: [],
        shutdownCode: 'abcdef',
        hintText: '',
        say: '',
        questions: [
            { question: '', answer: '', reward: '', asked: false, answered: false },
            { question: '', answer: '', reward: '', asked: false, answered: false },
            { question: '', answer: '', reward: '', asked: false, answered: false },
        ],
        eyes: {
            state: EyeState.NORMAL,
            interact: EyesInteractState.Hiding
        },
        camera: {
            faceCount: 0,
            listeningState: ListeningState.None,
            text: ''
        },
        recordings: [],
        timesPaused: 0,
        secondsPaused: 0,
        questionAttempts: 0
    }
}
