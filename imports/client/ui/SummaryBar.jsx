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
        const duration = moment.duration(game.secondsPaused, 'seconds');

        return (
            <div id="summary">
                <h1 className="title is-1 has-text-centered">{game.finalCode}</h1>
                <nav className="level topbar">
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Paused Times</p>
                            <p className="title">{game.timesPaused || 0}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Paused Hours</p>
                            <p className="title">{duration.hours()}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Paused Minutes</p>
                            <p className="title">{numeral(duration.minutes()).format('00')}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Paused Seconds</p>
                            <p className="title">{numeral(duration.seconds()).format('00')}</p>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

SummaryBar.propTypes = {
    game: PropTypes.object.isRequired
};
