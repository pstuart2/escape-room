import * as React from 'react'
import { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { Game, Games } from '../api/games'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { IdRoute } from '../api/models'
import { TabNav } from './components/TabNav'
import { Duration } from 'luxon'
import { Players } from './Players'
import { GameView } from './GameView'

interface GameRoutesTrackerProps {
  game: Game
  tab: string
}

type GameRoutesOwnProps = RouteComponentProps<IdRoute>

type GameRoutesProps = GameRoutesOwnProps & GameRoutesTrackerProps

export class GameRoutesComponent extends Component<GameRoutesProps> {
  render() {
    const { game, tab } = this.props

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
        <TabNav gameId={game._id} active={tab} />
        <Switch>
          <Route exact path="/:id/players" component={Players} game={game} />
          <Route exact path="/:id" component={GameView} game={game} />
        </Switch>
      </div>
    )
  }
}

export const GameRoutes = withTracker<GameRoutesTrackerProps, GameRoutesOwnProps>(ownProps => {
  Meteor.subscribe('game', ownProps.match.params.id)

  const tab = tabName(ownProps)
  const game = Games.findOne({ _id: ownProps.match.params.id })

  return { game, tab }
})(GameRoutesComponent)

const tabName = (props: GameRoutesOwnProps): string => {
  const id = props.match.params.id

  if (props.location.pathname === `/${id}/players`) return 'players'

  return 'game'
}
