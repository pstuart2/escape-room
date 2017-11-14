import { Mongo } from 'meteor/mongo';

export const Game = new Mongo.Collection('game');

export const GameState = {
    Pending: 0,
    Starting: 1,
    Running: 2,
    Paused: 3,
    Finished: 4
};

export const key = {
    'a': '00001',
    'b': '00010',
    'c': '00011',

    'd': '01000',
    'e': '00111',
    'f': '00100',
    'g': '00110',
    'h': '01001',
    'i': '00101',
    'j': '01100',
    'k': '01010',
    'l': '01110',
    'm': '01101',
    'n': '11010',
    'o': '10001',
    'p': '10000',
    'q': '10110',
    'r': '01111',
    's': '10101',
    't': '10010',
    'u': '10111',
    'v': '10100',
    'w': '11001',
    'x': '10011',
    'y': '11000',
    'z': '01011',
};

export const gameID = '0';

export function initialGame() {
    return {
        _id: gameID,
        name: 'This is the name',
        state: GameState.Pending,
        startingIn: 10,
        time: {
            seconds: 0,
            speed: 1,
        },
        players: [],
        finalCode: 'abcdef',
        hintText: '',
        questions: [
            { q: 'The youngest player must enter their birthday', a: '', h: 'mm/dd/yyyy' },
            { q: '', a: '', h: '' },
            { q: '', a: '', h: '' },
            { q: '', a: '', h: '' },
        ],
        commandsSent: [],
        timesPaused: 0,
        secondsPaused: 0
    }
}