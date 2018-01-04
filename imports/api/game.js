import { Mongo } from 'meteor/mongo';
import { EyeState } from '../eyes/animations';

export const Game = new Mongo.Collection('game');

export const GameState = {
    Pending: 0,
    Starting: 1,
    Running: 2,
    Paused: 3,
    Finished: 4
};

export const getGameStateString = (gameState) => {
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


export function initialGame(name) {
    return {
        name,
        createdAt: new Date(),
        state: GameState.Pending,
        startingIn: 10,
        time: {
            seconds: 0,
            speed: 1,
        },
        players: [],
        shutdownCode: 'abcdef',
        hintText: '',
        questions: [
            { q: 'The youngest player must enter their birthday in the format mm/dd/yyyy. For example if your birthday is February 6, 1974, the you should enter "02/06/1974"', a: '', h: 'mm/dd/yyyy', r: false },
            { q: '', a: '', h: '', r: false },
            { q: '', a: '', h: '', r: false },
        ],
        eyes: {
          state: EyeState.NORMAL
        },
        timesPaused: 0,
        secondsPaused: 0,
        questionAttempts: 0
    }
}
