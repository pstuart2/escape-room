import * as React from 'react'
import { Component } from 'react'
import { Game, Player } from '../api/games'
import { Id } from '../api/models'
import { CustomPlayerCard } from './components/CustomPlayerCard'

export interface PlayerCardProps {
  game: Game
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
    const { game, player } = this.props
    return (
      <div className="col-sm-6">
        <div className="player">
          <div className="float-right">
            <button className="btn btn-outline-danger btn-sm" onClick={this.handleDelete}>
              Delete
            </button>
          </div>
          <h4>{player.name}</h4>
          <CustomPlayerCard game={game} player={player} />
        </div>
      </div>
    )
  }
}
