import * as React from 'react'
import { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { Game, Games } from '../api/games'
import { RouteComponentProps } from 'react-router'
import { IdRoute } from '../api/models'
import { TabNav } from './components/TabNav'
import { Link } from 'react-router-dom'
import { ControlButtons } from './ControlButtons'
import { Duration } from 'luxon'

interface GameViewTrackerProps {
  game: Game
}

interface GameViewState {
  name: string
}

type GameViewOwnProps = RouteComponentProps<IdRoute>

type GameViewProps = GameViewOwnProps & GameViewTrackerProps

export class GameViewComponent extends Component<GameViewProps> {
  render() {
    const { game } = this.props

    if (!game || !game.time) {
      return null
    }

    const duration = Duration.fromMillis(game.time.gameRunningSeconds * 1000)
    const pausedDuration = Duration.fromMillis(game.time.pausedSeconds * 1000)

    return (
      <div id="game" className="container-fluid">
        <div className="alert alert-secondary">
          <div className="text-monospace float-right">
            Game Time&nbsp;&nbsp;: {duration.toFormat('hh:mm:ss')}
            <br />
            Paused Time: {pausedDuration.toFormat('hh:mm:ss')}
          </div>
          <h1>Game: {game.name}</h1>
        </div>
        <TabNav gameId={game._id} active="game" />
        <div className="tab-content" id="nav-tabContent">
          <div className="button-bar">
            <div className="float-right">
              <ControlButtons game={game} />
            </div>

            <Link to="/" className="btn btn-outline-secondary">
              Home
            </Link>

            <Link to={`${game._id}/dashboard`} className="btn btn-dark">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export const GameView = withTracker<GameViewTrackerProps, GameViewOwnProps>(ownProps => {
  Meteor.subscribe('game', ownProps.match.params.id)

  const game = Games.findOne({ _id: ownProps.match.params.id })

  return { game }
})(GameViewComponent)
