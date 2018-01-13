import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Game, initialGame } from '../../api/game.js';
import moment from 'moment';
import CodeBar from './CodeBar';
import PausedBar from './PausedBar';
import numeral from 'numeral';
import { GameState } from "../../api/game";
import StartingTimer from './StartingTimer';

export default class SummaryBar extends Component {


    render() {
        const { game } = this.props;
        const recordings = game.recordings.join('] [');

        return (
            <div id="summary">
                <h1 className="title is-1 has-text-centered">{game.shutdownCode}</h1>
                <div id="recordings">[{recordings}]</div>
            </div>
        );
    }
}

SummaryBar.propTypes = {
    game: PropTypes.object.isRequired
};
