import React, { Component } from 'react';
import { Game, initialGame, getGameStateString } from '../../api/game.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import moment from 'moment'
import numeral from 'numeral';

function formatTimeNumber(n) {
    return numeral(n).format('00');
}

class GameItem extends Component {
    render() {
        const { game } = this.props;
        const duration = moment.duration(game.time.seconds, 'seconds');
        const pauseDuration = moment.duration(game.secondsPaused, 'seconds');

        return (
            <div className="column is-4">
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                            {game.name} ({getGameStateString(game.state)})
                        </p>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            <ul>
                                <li>Players: {game.players.length}</li>
                                <li>Commands: {game.commandsSent.length}</li>
                                <li>Time: {formatTimeNumber(duration.hours())}:{formatTimeNumber(duration.minutes())}:{formatTimeNumber(duration.seconds())}</li>
                                <li>Times Paused: {game.timesPaused}</li>
                                <li>Time Paused: {formatTimeNumber(pauseDuration.hours())}:{formatTimeNumber(pauseDuration.minutes())}:{formatTimeNumber(pauseDuration.seconds())}</li>
                            </ul>
                        </div>
                    </div>
                    <footer className="card-footer">
                        <Link to={`/${game._id}/control`} className="card-footer-item">Control</Link>
                        <Link to={`/${game._id}/secret`} className="card-footer-item">Display</Link>
                        <a href="#" className="card-footer-item has-text-danger">Delete</a>
                    </footer>
                </div>
            </div>
        );
    }
}

class GameList extends Component {

    addGame() {
        Game.insert(initialGame(this.refs.gameName.value));
    }

    render() {
        const { games } = this.props;

        return (
            <div id="games" className="container is-fluid">
                <div className="columns" style={{ marginTop: 10 }}>
                    <div className="column is-11">
                        <input ref="gameName" className="input" type="text" placeholder="Name of this game"/>
                    </div>
                    <div className="column is-1">
                        <button className="button is-success" onClick={this.addGame.bind(this)}>Create</button>
                    </div>
                </div>

                <div className="columns is-multiline">
                    {games.map((g, i) => <GameItem key={i} game={g}/>)}
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('games');

    return {
        games: Game.find({}, { sort: { _id: -1 } }).fetch()
    };
})(GameList);
