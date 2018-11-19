import * as React from 'react'
import { Component } from 'react'
import { PlayerData } from '../../api/gameData'

export interface CustomPlayerFieldsProps {}

export class CustomPlayerFields extends Component<CustomPlayerFieldsProps> {
  getData = (): PlayerData => {
    return {}
  }

  render() {
    return <>...you can add custom player fields...</>
  }
}
