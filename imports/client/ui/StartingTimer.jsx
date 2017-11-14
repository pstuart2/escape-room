import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Game, initialGame } from '../../api/game.js';

const Player = ({index, player}) => (
    <div>{player.name}</div>
);

export default class StartingTimer extends Component {

    render() {
        const { game } = this.props;

        return (
            <div id="starting">
                <div className="columns">
                    <div className="column has-text-centered">
                        <div className="heading">Players</div>
                        <div className="title">
                            {game.players.map((p, i) => <Player key={i} index={i} player={p} />)}
                        </div>
                    </div>

                    <div className="column has-text-centered">
                        <div className="heading">Starting In...</div>
                        <div className="title startingIn">{game.startingIn}</div>
                    </div>
                </div>
            </div>
        );
    }
}

StartingTimer.propTypes = {
    game: PropTypes.object.isRequired
};
