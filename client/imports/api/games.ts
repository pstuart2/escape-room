import { Mongo } from 'meteor/mongo'
import { Id } from './models'

export const Games = new Mongo.Collection<Game>('games')

export interface GameListItem {
  _id?: string
  name: string
  createdAt: Date
  players: PlayerList
  state: GameState
  time: RunningInfo
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
  timesPaused: number
}

export type GameList = GameListItem[]

export interface Game extends GameListItem {}

export interface Player {
  _id: Id
  name: string
}

export type PlayerList = Player[]
