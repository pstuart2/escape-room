export type PlayerData = any

export enum KeypadMode {
  Floors = 0,
  AnsweringLetters = 1,
  AnsweringNumbers = 2,
}

export type GameData = {
  floor: number
  keys: string[]
  keypadMode: KeypadMode
  answer: string[]
  clue: string
  message: string
  messageSecondsLeft: number
}

export const getGameData = (): GameData => ({
  floor: 1,
  keys: [],
  keypadMode: KeypadMode.Floors,
  answer: [],
  clue: '',
  message: '',
  messageSecondsLeft: 0,
})
