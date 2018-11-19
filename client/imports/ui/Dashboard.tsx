import * as React from 'react'
import { Game, Games } from '../api/games'
import { RouteComponentProps } from 'react-router'
import { IdRoute } from '../api/models'
import { PureComponent } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { TopBar } from './dashboard/TopBar'
import { CustomDashboard } from './dashboard/CustomDashboard'

export interface DashboardTrackerProps {
  game: Game
}

type DashboardOwnProps = RouteComponentProps<IdRoute>

type DashboardProps = DashboardTrackerProps & DashboardOwnProps

export class DashboardComponent extends PureComponent<DashboardProps> {
  render() {
    const { game } = this.props

    if (!game || !game.time) {
      return null
    }

    return (
      <div id="dashboard" className="container-fluid">
        <TopBar game={game} />
        <CustomDashboard game={game} />
      </div>
    )
  }
}

export const Dashboard = withTracker<DashboardTrackerProps, DashboardOwnProps>(ownProps => {
  Meteor.subscribe('game', ownProps.match.params.id)

  const game = Games.findOne({ _id: ownProps.match.params.id })

  return { game }
})(DashboardComponent)
