import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Game } from '../../api/game.js';

// App component - represents the whole app
class TimerAndSecret extends Component {


    render() {
        const { game } = this.props;
        console.log(game);
        const {players} = game;

        return (
            <div id="secret">
                <nav className="level">
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Players</p>
                            <p className="title">{players.length}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Hours</p>
                            <p className="title">0</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Minutes</p>
                            <p className="title">27</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Seconds</p>
                            <p className="title">33</p>
                        </div>
                    </div>
                </nav>

                <div className="columns binary">
                    <div className="column has-text-centered">
                        <h1 className="title">0</h1>
                    </div>
                    <div className="column has-text-centered">
                        <h1 className="title">1</h1>
                    </div>
                    <div className="column has-text-centered">
                        <h1 className="title">0</h1>
                    </div>
                    <div className="column has-text-centered">
                        <h1 className="title">1</h1>
                    </div>
                    <div className="column has-text-centered">
                        <h1 className="title">1</h1>
                    </div>
                </div>
            </div>
        );
    }
}

TimerAndSecret.propTypes = {
    game: PropTypes.object.isRequired
};

export default createContainer( () => {
    return { game: Game.findOne( {} ) || {players: []} };
}, TimerAndSecret );
