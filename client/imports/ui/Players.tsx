import * as React from 'react'
import { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { Game, Games } from '../api/games'
import { RouteComponentProps } from 'react-router'
import { Id, IdRoute } from '../api/models'
import * as uniqid from 'uniqid'
import { TabNav } from './components/TabNav'
import { PlayerCard } from './PlayerCard'
import { Simulate } from 'react-dom/test-utils'
import play = Simulate.play

interface PlayersTrackerProps {
  game: Game
}

interface PlayersState {
  name: string
}

type PlayersOwnProps = RouteComponentProps<IdRoute>

type PlayersProps = PlayersOwnProps & PlayersTrackerProps

export class PlayersComponent extends Component<PlayersProps> {
  state: PlayersState = {
    name: '',
  }

  addPlayer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { name } = this.state
    const { game } = this.props

    const player = {
      _id: uniqid(),
      name,
    }

    Games.update({ _id: game._id }, { $push: { players: player } })

    this.setState({ name: '' })
  }

  deletePlayer = (playerId: Id) => {
    const { game } = this.props

    Games.update({ _id: game._id }, { $pull: { players: { _id: playerId } } })
  }

  changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.currentTarget.value })
  }

  render() {
    const { game } = this.props
    const { name } = this.state

    if (!game) {
      return null
    }

    return (
      <div id="players" className="container-fluid">
        <div className="alert alert-secondary">
          <h1 className="display-4">Game: {game.name}</h1>
        </div>
        <TabNav gameId={game._id} active="players" />
        <div className="tab-content" id="nav-tabContent">
          <form onSubmit={this.addPlayer}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Player name"
                value={name}
                onChange={this.changeName}
              />
              <div className="input-group-append">
                <button className="btn btn-success" type="submit">
                  Add
                </button>
              </div>
            </div>
          </form>
          <div id="playerGrid" className="row">
            {game.players.map(p => (
              <PlayerCard key={p._id} player={p} onDelete={this.deletePlayer} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export const Players = withTracker<PlayersTrackerProps, PlayersOwnProps>(ownProps => {
  Meteor.subscribe('game', ownProps.match.params.id)

  const game = Games.findOne({ _id: ownProps.match.params.id })

  return { game }
})(PlayersComponent)
