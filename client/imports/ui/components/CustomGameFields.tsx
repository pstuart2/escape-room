import * as React from 'react'
import { Component } from 'react'
import { Game, Games } from '../../api/games'

export interface CustomGameFieldsProps {
  game: Game
}

export class CustomGameFields extends Component<CustomGameFieldsProps> {
  changeGate1Answer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { game } = this.props

    Games.update({ _id: game._id }, { $set: { 'data.game1Answer': e.currentTarget.value } })
  }

  render() {
    const {
      game: { data },
    } = this.props

    return (
      <>
        <div className="form-group">
          <label htmlFor="gate1Answer">Gate 1 Answer</label>
          <input
            type="text"
            className="form-control"
            id="gate1Answer"
            value={data.gate1Answer}
            onChange={this.changeGate1Answer}
          />
        </div>
      </>
    )
  }
}
