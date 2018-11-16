import * as React from 'react'
import { Component } from 'react'
import { Game } from '../../api/games'

export interface CustomGameFieldsProps {
  game: Game
}

export class CustomGameFields extends Component<CustomGameFieldsProps> {
  render() {
    return <h1>CustomGameFields</h1>
  }
}
