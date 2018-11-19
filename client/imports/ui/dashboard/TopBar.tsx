import * as React from 'react'
import { Component, PureComponent } from 'react'
import { Game, GameState, RunningInfo } from '../../api/games'
import { Duration } from 'luxon'
import { CustomTopBar } from './CustomTopBar'

export interface GameTimeProps {
  game: Game
}

interface TimeColProps {
  info: RunningInfo
  state: GameState
}

class TimeCol extends PureComponent<TimeColProps> {
  render() {
    const { state, info } = this.props

    if (state === GameState.Starting) {
      return <span className="text-info">Starting in {info.startingInSeconds}</span>
    }

    const duration = Duration.fromMillis(info.gameRunningSeconds * 1000).toFormat('hh:mm:ss')

    switch (state) {
      case GameState.Paused:
        return (
          <span className="text-danger">
            <i className="fas fa-pause" /> {duration}
          </span>
        )

      case GameState.Finished:
        return (
          <span className="text-success">
            <i className="fas fa-clock" /> {duration}
          </span>
        )
    }

    return (
      <span>
        <i className="fas fa-stopwatch" /> {duration}
      </span>
    )
  }
}

export class TopBar extends Component<GameTimeProps> {
  render() {
    const { game } = this.props

    if (!game || !game.time) {
      return null
    }

    return (
      <div id="topBar" className="row">
        <div className="col-sm">
          <div className="display-4">
            <TimeCol info={game.time} state={game.state} />
          </div>
        </div>
        <CustomTopBar game={game} />
      </div>
    )
  }
}
