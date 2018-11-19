import * as React from 'react'
import { Component } from 'react'
import { Game } from '../../api/games'

export interface CustomDashboardProps {
  game: Game
}

export class CustomDashboard extends Component<CustomDashboardProps> {
  render() {
    return <h1>...you can customize this...</h1>
  }
}
