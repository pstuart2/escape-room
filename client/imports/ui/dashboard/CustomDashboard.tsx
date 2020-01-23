import * as React from 'react'
import { Component } from 'react'
import { Game } from '../../api/games'

export interface CustomDashboardProps {
  game: Game
}

export class CustomDashboard extends Component<CustomDashboardProps> {
  render() {
    const {
      data: { keys, message, messageSecondsLeft, clue },
    } = this.props.game

    return (
      <>
        <h1 className="display-2 text-center text-info" style={{ marginTop: 60 }}>
          {messageSecondsLeft > 0 ? message : <span>&nbsp;</span>}
        </h1>
        <h1 className="display-1 text-center text-primary" style={{ marginTop: 60 }}>
          {keys.length > 0 ? keys.join('') : <span>&nbsp;</span>}
        </h1>
        <h1 className="display-3 text-center text-success" style={{ marginTop: 60 }}>
          {clue}
        </h1>
      </>
    )
  }
}
