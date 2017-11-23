import { Mongo } from 'meteor/mongo';

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

export const key = {
    'a': '00001',
    'b': '00010',
    'c': '00011',

    'd': '01000',   // q2
    'e': '00111',   // q2
    'f': '00100',   // q2
    'g': '00110',   // q1
    'h': '01001',   // q1
    'i': '00101',   // q1
    'j': '01100',   // taped to mouse
    'k': '01010',   // taped to mouse
    'l': '01110',   // taped to mouse
    'm': '01101',   // blue lock box
    'n': '11010',   // blue lock box
    'o': '10001',   // blue lock box
    'p': '10000',   // q3
    'q': '10110',   // q3
    'r': '01111',   // q3
    's': '10101',   // map
    't': '10010',   // map
    'u': '10111',   // map
    'v': '10100',   // black light
    'w': '11001',   // black light
    'x': '10011',   // black light
    'y': '11000',   // black light
    'z': '01011',   // black light
};

export function getQuestionReward(index) {
    let result = [];

    switch (index) {
        case 0:
            result.push({key: 'g', value: key['g']});
            result.push({key: 'h', value: key['h']});
            result.push({key: 'i', value: key['i']});
            break;

        case 1:
            result.push({key: 'd', value: key['d']});
            result.push({key: 'e', value: key['e']});
            result.push({key: 'f', value: key['f']});
            break;

        case 2:
            result.push({key: 'p', value: key['p']});
            result.push({key: 'q', value: key['q']});
            result.push({key: 'r', value: key['r']});
            break;

        default:
            return null;
    }

    return result;
}

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
        commandsSent: [],
        timesPaused: 0,
        secondsPaused: 0,
        questionAttempts: 0
    }
}
