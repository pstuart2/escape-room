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
    'd': '00100',
    'e': '00101',
    'f': '00110',
    'g': '00111',
    'h': '01000',
    'i': '01001',
    'j': '01010',
    'k': '01011',
    'l': '01100',
    'm': '01101',
    'n': '01110',
    'o': '01111',
    'p': '10000',
    'q': '10001',
    'r': '10010',
    's': '10011',
    't': '10100',
    'u': '10101',
    'v': '10110',
    'w': '10111',
    'x': '11000',
    'y': '11001',
    'z': '11010',
};

export const spareKey = {
    'a': 'OOXXO',
    'b': 'OOXOO',
    'c': 'OOOXX',
    'd': 'OOXOX',
    'e': 'OOOOX',
    'f': 'OOOXO',
    'g': 'OXOOX',
    'h': 'OXOOO',
    'i': 'OOXXX',
    'j': 'OXXXO',
    'k': 'OXXOX',
    'l': 'XXOXO',
    'm': 'OXOXX',
    'n': 'OXXOO',
    'o': 'OXOXO',
    'p': 'OXXXX',
    'q': 'XOOOO',
    'r': 'XOOOX',
    's': 'XOXOO',
    't': 'XOOXO',
    'u': 'XOXXO',
    'v': 'XXOOX',
    'w': 'XOOXX',
    'x': 'XOXOX',
    'y': 'XOXXX',
    'z': 'XXOOO',
};

export function initialGame() {
    return {
        name: 'This is the name',
        state: GameState.Running,
        startingIn: 10,
        time: {
            secondsLeft: 3600,
            speed: 1,
        },
        players: [ 'Logan', 'Mason', 'Ducan' ],
        finalCode: 'abcdef',
        hintText: ''
    }
}