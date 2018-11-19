import * as React from 'react'
import { Component } from 'react'
import { Game } from '../../api/games'

export interface CustomTopBarProps {
  game: Game
}

export class CustomTopBar extends Component<CustomTopBarProps> {
  render() {
    const { game } = this.props

    return (
      <div className="col-sm">
        <div>{game.data.stateText}</div>
      </div>
    )
  }
}
