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

class TimerAndSecret extends Component {


    render() {
        const { players, finalCode, hours, minutes, seconds, gameState, hintText } = this.props;

        console.log(gameState);

        if (gameState === GameState.Pending) {
            return <div id="secret" />
        }

        if (gameState === GameState.Starting) {
            return <StartingTimer />
        }


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

                {gameState === GameState.Running && <CodeBar finalCode={finalCode}/>}
                {gameState === GameState.Paused && <PausedBar/>}

                <div className="has-text-grey-dark has-text-centered hint-text">{hintText}</div>
            </div>
        );
    }
}

TimerAndSecret.propTypes = {
    players: PropTypes.array.isRequired,
    finalCode: PropTypes.string.isRequired,
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
    gameState: PropTypes.number.isRequired,
    hintText: PropTypes.string.isRequired
};

export default withTracker(() => {
    const game = Game.findOne({}) || initialGame();

    const { players, finalCode, time, hintText, state } = game;
    const duration = moment.duration(time.seconds, 'seconds');

    return {
        players,
        finalCode,
        gameState: state,
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
        isRunning: time.isRunning,
        hintText
    };
})(TimerAndSecret);
