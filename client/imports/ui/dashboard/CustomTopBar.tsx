import * as React from 'react'
import { Component } from 'react'
import { Game } from '../../api/games'

export interface CustomTopBarProps {
  game: Game
}

export class CustomTopBar extends Component<CustomTopBarProps> {
  render() {
    const {
      data: { floor },
    } = this.props.game
    return (
      <div className="col-sm text-right">
        <div className="display-4">
          <span className="text-secondary">Floor:</span> <span className="text-white">{floor}</span>
        </div>
      </div>
    )
  }
}
