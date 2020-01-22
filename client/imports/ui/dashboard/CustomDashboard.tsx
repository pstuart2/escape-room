import * as React from 'react'
import { Component } from 'react'
import { Game } from '../../api/games'

export interface CustomDashboardProps {
  game: Game
}

export class CustomDashboard extends Component<CustomDashboardProps> {
  render() {
    const {
      data: { keys },
    } = this.props.game

    return (
      <h1 className="display-1 text-center text-primary" style={{ marginTop: 60 }}>
        {keys.join('')}
      </h1>
    )
  }
}
