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

export interface Data {
  scriptState: ScriptState
  stateText: string
  gate1Answer: string
}
