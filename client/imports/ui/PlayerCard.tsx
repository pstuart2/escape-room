import * as React from 'react'
import { Component } from 'react'
import { Player } from '../api/games'
import { Id } from '../api/models'

export interface PlayerCardProps {
  player: Player
  onDelete: (id: Id) => void
}

export class PlayerCard extends Component<PlayerCardProps> {
  handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const { player, onDelete } = this.props
    onDelete(player._id)
  }

  render() {
    const { player, onDelete } = this.props
    return (
      <div className="col-sm-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{player.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{player._id}</h6>
            <p className="card-text" />
            <button className="btn btn-link" onClick={this.handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }
}
