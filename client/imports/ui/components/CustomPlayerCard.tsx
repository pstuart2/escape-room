import * as React from 'react'
import { Component } from 'react'
import { Game, Player } from '../../api/games'

export interface CustomPlayerCardProps {
  game: Game
  player: Player
}

export class CustomPlayerCard extends Component<CustomPlayerCardProps> {
  render() {
    return <></>
  }
}
