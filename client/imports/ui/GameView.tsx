import * as React from 'react'
import { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { Game, Games } from '../api/games'
import { RouteComponentProps } from 'react-router'
import { IdRoute } from '../api/models'
import * as uniqid from 'uniqid'
import { TabNav } from './components/TabNav'
import { Link } from 'react-router-dom'

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

    if (!game) {
      return null
    }

    return (
      <div id="game" className="container-fluid">
        <div className="alert alert-secondary">
          <h1 className="display-4">Game: {game.name}</h1>
        </div>
        <TabNav gameId={game._id} active="game" />
        <div className="tab-content" id="nav-tabContent">
          <div className="button-bar">
            <button className="btn btn-success">Start</button>
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
