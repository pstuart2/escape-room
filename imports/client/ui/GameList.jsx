import React, { Component } from 'react';
import { Game, initialGame } from '../../api/game.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

class GameItem extends Component {
    render() {
        const { game } = this.props;

        return (
            <div className="column is-4">
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                            {game.name}
                        </p>
                    </header>
                    <div className="card-content">
                        <div className="content">

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
        const gameId = Game.insert(initialGame(this.refs.gameName.value));
        console.log(gameId);
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
    return {
        games: Game.find({}, { sort: { _id: -1 } }).fetch()
    };
})(GameList);
