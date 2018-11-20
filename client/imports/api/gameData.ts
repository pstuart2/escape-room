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

export interface GameData {
  scriptState: ScriptState
  stateText: string

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
}

export const getGameData = (): GameData => ({
  scriptState: ScriptState.WaitingOnFirstKey,

  stateText: 'Find the first key',
  clueText: '',

  clueForSecondKey: 'What does everybody want to rule?', // Answer "world" for word lock
  clueForThirdKey: 'Who was the rabbit that was framed?', // Answer "roger" for second word lock

  clueForFirstGate: 'Use the code to figure out the question. Use the blue chips to answer it',
  clueForSecondGate: '',
  clueForThirdGate: '',

  key1RfidText: 'first_key',
  key2RfidText: 'second_key',
  key3RfidText: 'third_key',

  gate1Answer: 'logan',
})
