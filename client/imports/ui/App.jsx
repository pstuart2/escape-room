import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Games } from '../api/games'
import * as R from 'ramda'
import { DateTime } from 'luxon'

export class AppComponent extends Component {
  state = {
    name: '',
  }

  createGame = (e) => {
    e.preventDefault()

    const { name } = this.state

    const id = Games.insert({ name, createdAt: DateTime.local().toJSDate() })
    console.log(`Game Created ${id}`)

    this.setState({ name: '' })
  }

  changeName = (e) => {
    this.setState({ name: e.target.value })
  }

  render() {
    const { games } = this.props
    const { name } = this.state

    return (
      <div id="app" className="container-fluid">
        <div>
          <Link to="/dashboard" className="btn btn-dark">Dashboard</Link>
        </div>
        <form onSubmit={this.createGame}>
          <div className="form-group">
            <label htmlFor="gameName">Game Name</label>
            <input type="text" onChange={this.changeName} value={name} className="form-control"
                   id="gameName"/>
          </div>
          <button type="submit" className="btn btn-success">Create</button>
        </form>
        <h3>Games</h3>

        <ul>
          {games.map(g => <li key={g._id}>{g.name}</li>)}
        </ul>
      </div>
    )
  }
}

export const App = withTracker(() => {
  Meteor.subscribe('gameList')
  const games = R.reverse(R.sortBy(R.prop('createdAt'))(Games.find({}).fetch()))

  return {
    games,
  }
})(AppComponent)
