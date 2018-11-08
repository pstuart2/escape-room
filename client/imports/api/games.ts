import { Mongo } from 'meteor/mongo'

export const Games = new Mongo.Collection('games')

export interface GameListItem {
  _id: string
  name: string
  createdAt: Date
}

export type GameList = GameListItem[]
