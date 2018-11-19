import * as React from 'react'
import { Component } from 'react'
import { Game, Games } from '../api/games'
import { Link, RouteComponentProps } from 'react-router-dom'
import { ControlButtons } from './ControlButtons'
import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { IdRoute } from '../api/models'
import { CustomGameFields } from './components/CustomGameFields'

interface GameViewTrackerProps {
  game: Game
}

type GameRoutesOwnProps = RouteComponentProps<IdRoute>

type GameViewProps = GameViewTrackerProps & GameRoutesOwnProps

export class GameViewComponent extends Component<GameViewProps> {
  render() {
    const { game } = this.props

    if (!game || !game.time) {
      return null
    }

    return (
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
          <div className="custom-game-fields">
            <CustomGameFields game={game} />
          </div>
        </div>
      </div>
    )
  }
}

export const GameView = withTracker<GameViewTrackerProps, GameRoutesOwnProps>(ownProps => {
  Meteor.subscribe('game', ownProps.match.params.id)

  const game = Games.findOne({ _id: ownProps.match.params.id })

  return { game }
})(GameViewComponent)
