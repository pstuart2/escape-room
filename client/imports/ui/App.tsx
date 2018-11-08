import * as React from 'react'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { GameList, Games } from '../api/games'
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

    Games.insert({ name, createdAt: DateTime.local().toJSDate() })

    this.setState({ name: '' })
  }

  changeName = (e: React.FormEvent<HTMLInputElement>) => {
    console.log(e)
    this.setState({ name: e.currentTarget.value })
  }

  render() {
    const { games } = this.props
    const { name } = this.state

    return (
      <div id="app" className="container-fluid">
        <div>
          <Link to="/dashboard" className="btn btn-dark">
            Dashboard
          </Link>
        </div>
        <form onSubmit={this.createGame}>
          <div className="form-group">
            <label htmlFor="gameName">Game Name</label>
            <input type="text" onChange={this.changeName} value={name} className="form-control" id="gameName" />
          </div>
          <button type="submit" className="btn btn-success">
            Create
          </button>
        </form>
        <h3>Games</h3>

        <ul>
          {games.map(g => (
            <li key={g._id}>{g.name}</li>
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
