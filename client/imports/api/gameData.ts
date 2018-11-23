export type PlayerData = any

export enum ScriptState {
  WaitingOnFirstKey = 0,
  InFirstGate = 1,
  WaitingOnSecondKey = 2,
  InSecondGate = 3,
  WaitingOnThirdKey = 4,
  InThirdGate = 5,
  WaitingOnEgg = 6,
  Complete = 7,
}

export enum AnswerState {
  Answering = 0,
  Wrong = 1,
  Correct = 2,
}

export interface GameData {
  scriptState: ScriptState
  answerState: AnswerState

  stateText: string
  stateAnswer: string

  clueText: string

  key1RfidText: string
  key2RfidText: string
  key3RfidText: string

  clueForSecondKey: string
  clueForThirdKey: string

  clueForFirstGate: string
  clueForSecondGate: string
  clueForThirdGate: string

  gate1Answer: string
  gate2Answer: string
  gate3Answer: DistanceTestList

  currentDistances: number[]
  currentDistanceTestIndex: number
  currentDistanceTestSeconds: number
}

export interface DistanceTest {
  distances: number[]
  seconds: number
}

export type DistanceTestList = DistanceTest[]

export const getGameData = (): GameData => ({
  scriptState: ScriptState.WaitingOnFirstKey,
  answerState: AnswerState.Answering,

  stateText: 'Find the first key',
  stateAnswer: '',
  clueText: '',

  clueForSecondKey: 'What does everybody want to rule?', // Answer "world" for word lock
  clueForThirdKey: 'What type of science? Look for clues in the room.', // Answer "weird" for second word lock

  clueForFirstGate: 'Use the code to figure out the question. Use the blue chips to answer it',
  clueForSecondGate: 'N = Go North,E = Go East,S = Go South,W = Go West,F = Fight,P = Pick Up,D = Drop', // TODO: Script map for them to follow
  clueForThirdGate: '3 is a magic number. 3 numbers to set, 3 times before time runs out',

  key1RfidText: 'first_key',
  key2RfidText: 'second_key',
  key3RfidText: 'third_key',

  gate1Answer: 'logan',
  gate2Answer: 'nnnefepwwsw',
  gate3Answer: [
    { distances: [5, 10, 15], seconds: 15 },
    { distances: [12, 8, 2], seconds: 10 },
    { distances: [3, 6, 9], seconds: 5 },
  ],

  currentDistances: [0, 0, 0],
  currentDistanceTestIndex: 0,
  currentDistanceTestSeconds: 0,
})
