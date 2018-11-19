import { Mongo } from 'meteor/mongo'
import { Id } from './models'
import { GameData, getGameData, PlayerData } from './gameData'

export const Games = new Mongo.Collection<Game>('games')

export interface GameListItem {
  _id?: string
  name: string
  createdAt: Date
  players: PlayerList
  state: GameState
  time: RunningInfo
  data: GameData
}

export enum GameState {
  Pending = 0,
  Starting = 1,
  Running = 2,
  Paused = 3,
  Finished = 4,
}

export interface RunningInfo {
  startedAt: Date
  startingInSeconds: number
  gameRunningSeconds: number
  pausedSeconds: number
}

export type GameList = GameListItem[]

export interface Game extends GameListItem {}

export interface Player {
  _id: Id
  name: string
  data: PlayerData
}

export type PlayerList = Player[]

export const createGame = (name: string, d: Date) => {
  const players: PlayerList = []

  return {
    name,
    createdAt: d,
    players,
    state: GameState.Pending,
    time: {
      startedAt: d,
      startingInSeconds: 0,
      gameRunningSeconds: 0,
      pausedSeconds: 0,
    },
    data: getGameData(),
  }
}
