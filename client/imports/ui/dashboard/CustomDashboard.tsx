import * as React from 'react'
import { Component } from 'react'
import { Game, GameState } from '../../api/games'

export interface CustomDashboardProps {
  game: Game
}

class Check extends Component<{ isGreen: boolean }> {
  render() {
    const { isGreen } = this.props
    const cname = isGreen ? 'text-success' : 'text-dark'
    return (
      <span className={cname} style={{ marginRight: 40 }}>
        <i className="fas fa-check" />
      </span>
    )
  }
}

export class CustomDashboard extends Component<CustomDashboardProps> {
  render() {
    const {
      state,
      data: { keys, message, messageSecondsLeft, clue, actualFloorSequence },
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
          {clue || <span>&nbsp;</span>}
        </h1>
        {state >= GameState.Running && (
          <h1 className="display-1 text-center" style={{ marginTop: 60 }}>
            <Check isGreen={actualFloorSequence.length > 0} />
            <Check isGreen={actualFloorSequence.length > 1} />
            <Check isGreen={actualFloorSequence.length > 2} />
          </h1>
        )}
      </>
    )
  }
}
