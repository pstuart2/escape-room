import * as React from 'react'
import { Component } from 'react'
import { Game, Games } from '../../api/games'

export interface CustomGameFieldsProps {
  game: Game
}

export class CustomGameFields extends Component<CustomGameFieldsProps> {
  changeGate1Answer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { game } = this.props

    Games.update({ _id: game._id }, { $set: { 'data.gate1Answer': e.currentTarget.value.toLowerCase() } })
  }

  changeKey1RfidText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { game } = this.props

    Games.update({ _id: game._id }, { $set: { 'data.key1RfidText': e.currentTarget.value } })
  }

  changeKey2RfidText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { game } = this.props

    Games.update({ _id: game._id }, { $set: { 'data.key2RfidText': e.currentTarget.value } })
  }

  changeKey3RfidText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { game } = this.props

    Games.update({ _id: game._id }, { $set: { 'data.key3RfidText': e.currentTarget.value } })
  }

  render() {
    const {
      game: { data },
    } = this.props

    return (
      <div style={{ marginTop: '10px' }}>
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

        <div className="form-group">
          <label htmlFor="key1RfidText">Key 1 RFID text</label>
          <input
            type="text"
            className="form-control"
            id="key1RfidText"
            value={data.key1RfidText}
            onChange={this.changeKey1RfidText}
          />
        </div>

        <div className="form-group">
          <label htmlFor="key2RfidText">Key 2 RFID text</label>
          <input
            type="text"
            className="form-control"
            id="key2RfidText"
            value={data.key2RfidText}
            onChange={this.changeKey2RfidText}
          />
        </div>

        <div className="form-group">
          <label htmlFor="key3RfidText">Key 3 RFID text</label>
          <input
            type="text"
            className="form-control"
            id="key3RfidText"
            value={data.key3RfidText}
            onChange={this.changeKey3RfidText}
          />
        </div>
      </div>
    )
  }
}
