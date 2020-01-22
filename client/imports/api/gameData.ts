export type PlayerData = any
export type GameData = {
  floor: number
  keys: string[]
}

export const getGameData = (): GameData => ({ floor: 1, keys: [] })
