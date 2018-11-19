import * as React from 'react'
import { Component } from 'react'
import { Game } from '../../api/games'

export interface CustomTopBarProps {
  game: Game
}

export class CustomTopBar extends Component<CustomTopBarProps> {
  render() {
    return (
      <div className="col-sm">
        <div>...you can customize this...</div>
      </div>
    )
  }
}
