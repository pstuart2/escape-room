import * as React from 'react'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { GameList, Games, GameState } from '../api/games'
import * as R from 'ramda'
import { DateTime } from 'luxon'
import { Meteor } from 'meteor/meteor'

interface AppProps {
  games: GameList
}

interface AppState {
  name: string
}

export class AppComponent extends Component<AppProps> {
  state: AppState = {
    name: '',
  }

  createGame = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { name } = this.state

    Games.insert({
      name,
      createdAt: DateTime.local().toJSDate(),
      players: [],
      state: GameState.Pending,
      time: {
        startedAt: DateTime.local().toJSDate(),
        startingInSeconds: 0,
        gameRunningSeconds: 0,
        timesPaused: 0,
      },
    })

    this.setState({ name: '' })
  }

  changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.currentTarget.value })
  }

  render() {
    const { games } = this.props
    const { name } = this.state

    return (
      <div id="app" className="container-fluid">
        <form onSubmit={this.createGame}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Game name"
              value={name}
              onChange={this.changeName}
            />
            <div className="input-group-append">
              <button className="btn btn-success" type="submit">
                Create
              </button>
            </div>
          </div>
        </form>
        <h3>Games</h3>

        <ul>
          {games.map(g => (
            <li key={g._id}>
              <Link to={`/${g._id}`}>{g.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export const App = withTracker<{}, AppProps>(() => {
  Meteor.subscribe('gameList')
  const games = R.reverse(R.sortBy(R.prop('createdAt'))(Games.find({}).fetch()))

  return {
    games,
  }
})(AppComponent)
