import { Mongo } from 'meteor/mongo'
import { Id } from './models'

export const Games = new Mongo.Collection<Game>('games')

export interface GameListItem {
  _id?: string
  name: string
  createdAt: Date
  players: PlayerList
}

export type GameList = GameListItem[]

export interface Game extends GameListItem {}

export interface Player {
  _id: Id
  name: string
}

export type PlayerList = Player[]
