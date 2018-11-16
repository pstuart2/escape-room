import * as React from 'react'
import { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { Game, Games } from '../api/games'
import { RouteComponentProps } from 'react-router'
import { IdRoute } from '../api/models'

interface GameTrackerProps {
  game: Game
}

type GameOwnProps = RouteComponentProps<IdRoute>

type GameProps = GameOwnProps & GameTrackerProps

export class GameComponent extends Component<GameProps> {
  render() {
    return <h1>Game</h1>
  }
}

export const Game = withTracker<GameTrackerProps, GameOwnProps>(ownProps => {
  Meteor.subscribe('game', ownProps.match.params.id)

  const game = Games.findOne({ _id: ownProps.match.params.id })

  return { game }
})(GameComponent)
