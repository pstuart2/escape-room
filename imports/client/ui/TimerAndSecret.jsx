import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Game } from '../../api/game.js';
import moment from 'moment';
import CodeBar from './CodeBar';
import PausedBar from './PausedBar';
import numeral from 'numeral';

class TimerAndSecret extends Component {


    render() {
        const { players, finalCodes, hours, minutes, seconds, isRunning, hintText } = this.props;


        return (
            <div id="secret">
                <nav className="level topbar">
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Players</p>
                            <p className="title">{players.length}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Hours</p>
                            <p className="title">{hours}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Minutes</p>
                            <p className="title">{numeral(minutes).format('00')}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Seconds</p>
                            <p className="title">{numeral(seconds).format('00')}</p>
                        </div>
                    </div>
                </nav>

                {isRunning && <CodeBar finalCodes={finalCodes}/>}
                {!isRunning && <PausedBar/>}

                <div className="has-text-grey-dark has-text-centered hint-text">{hintText}</div>
            </div>
        );
    }
}

TimerAndSecret.propTypes = {
    players: PropTypes.array.isRequired,
    finalCodes: PropTypes.array.isRequired,
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
    isRunning: PropTypes.bool.isRequired,
    hintText: PropTypes.string.isRequired
};

export default withTracker(() => {
    const game = Game.findOne({}) || {
        players: [],
        finalCodes: [ [ ' ', ' ', ' ', ' ', ' ' ] ],
        time: { secondsLeft: 0, isRunning: false },
        hintText: ''
    };

    const { players, finalCodes, time, hintText } = game;
    const duration = moment.duration(time.secondsLeft, 'seconds');

    return {
        players,
        finalCodes,
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
        isRunning: time.isRunning,
        hintText
    };
})(TimerAndSecret);
