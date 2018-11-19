export type PlayerData = any

export enum ScriptState {
  WaitingForFirstKey = 0,
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
  gate1Answer: string
}

export const getGameData = (): GameData => ({
  scriptState: ScriptState.WaitingForFirstKey,
  stateText: 'Looking for first key',
  gate1Answer: '',
})
