import * as React from 'react'
import { Component } from 'react'
import { Game } from '../../api/games'
import { GameData, ScriptState } from '../../api/gameData'

export interface CustomTopBarProps {
  game: Game
}

const getIcon = (data: GameData) => {
  switch (data.scriptState) {
    case ScriptState.WaitingOnFirstKey:
    case ScriptState.WaitingOnSecondKey:
    case ScriptState.WaitingOnThirdKey:
      return <i className="fas fa-key" />

    case ScriptState.InFirstGate:
    case ScriptState.InSecondGate:
    case ScriptState.InThirdGate:
      return <i className="fas fa-archway" />
  }

  return <i className="fas fa-trophy" />
}

export class CustomTopBar extends Component<CustomTopBarProps> {
  render() {
    const {
      game: { data },
    } = this.props

    return (
      <div className="col-sm" style={{ textAlign: 'right' }}>
        <div className="display-4">
          {getIcon(data)} {data.stateText}
        </div>
      </div>
    )
  }
}
