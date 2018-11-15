import * as React from 'react'
import { PureComponent } from 'react'
import { GameListItem, GameState } from '../api/games'
import { Meteor } from 'meteor/meteor'

export interface ControlButtonsProps {
  game: GameListItem
}

export class PendingButtons extends PureComponent<ControlButtonsProps> {
  onStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const { game } = this.props

    Meteor.call('start', game._id, (e: any) => {
      console.log('error', e)
    })
  }

  render() {
    const { game } = this.props

    return (
      <>
        <button className="btn btn-success" onClick={this.onStart} disabled={game.state === GameState.Starting}>
          {game.state === GameState.Pending ? 'Start' : `Starting...${game.time.startingInSeconds}`}
        </button>
      </>
    )
  }
}

export class RunningButtons extends PureComponent<ControlButtonsProps> {
  onPause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const { game } = this.props

    Meteor.call('pause', game._id, (e: any) => {
      console.log('error', e)
    })
  }

  onResume = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const { game } = this.props

    Meteor.call('resume', game._id, (e: any) => {
      console.log('error', e)
    })
  }

  onStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const { game } = this.props

    Meteor.call('stop', game._id, (e: any) => {
      console.log('error', e)
    })
  }

  render() {
    const { game } = this.props

    return (
      <>
        {game.state === GameState.Paused ? (
          <button className="btn btn-warning" onClick={this.onResume}>
            Resume
          </button>
        ) : (
          <button className="btn btn-warning" onClick={this.onPause}>
            Pause
          </button>
        )}

        <button className="btn btn-error" onClick={this.onStop}>
          Stop
        </button>
      </>
    )
  }
}

export class ControlButtons extends PureComponent<ControlButtonsProps> {
  render() {
    const { game } = this.props
    switch (game.state) {
      case GameState.Pending:
      case GameState.Starting:
        return <PendingButtons game={game} />

      case GameState.Running:
      case GameState.Paused:
        return <RunningButtons game={game} />
    }

    return null
  }
}
