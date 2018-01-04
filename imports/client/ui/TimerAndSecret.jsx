import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Game, initialGame } from '../../api/game.js';
import moment from 'moment';
import Eyes from './Eyes';
import numeral from 'numeral';
import { GameState } from "../../api/game";
import StartingTimer from './StartingTimer';
import SummaryBar from './SummaryBar';

const HintText = ({ hintText }) => (
    <div className="level hint-item">
        <div className="level-left">
            <div className="level-item">
                <figure className="image is-64x64">
                    <img src="/light-bulb.png"/>
                </figure>
            </div>
            <div className="level-item">
                <div className="has-text-grey-dark hint-text">{hintText}</div>
            </div>
        </div>
    </div>
);

class TimerAndSecret extends Component {


    render() {
        const { game, players, shutdownCode, hours, minutes, seconds, gameState, hintText } = this.props;

        // if ( gameState === GameState.Pending ) {
        //     return <div id="secret"/>
        // }
        //
        // if ( gameState === GameState.Starting ) {
        //     return <StartingTimer game={game}/>
        // }


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
                            <p className="heading">Commands</p>
                            <p className="title">{game.commandsSent.length}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Answers</p>
                            <p className="title">{game.questionAttempts || 0}</p>
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

                <Eyes />

                {gameState === GameState.Finished && <SummaryBar game={game}/>}

                <HintText hintText="This is the hint"/>


            </div>
        );
    }
}

TimerAndSecret.propTypes = {
    players: PropTypes.array.isRequired,
    shutdownCode: PropTypes.string.isRequired,
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
    gameState: PropTypes.number.isRequired,
    hintText: PropTypes.string.isRequired
};

export default withTracker(({ match }) => {
    Meteor.subscribe('game', match.params.id);

    const game = Game.findOne({ _id: match.params.id }) || initialGame();

    const { players, shutdownCode, time, hintText, state } = game;
    const duration = moment.duration(time.seconds, 'seconds');

    return {
        game,
        players,
        shutdownCode,
        gameState: state,
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
        isRunning: time.isRunning,
        hintText
    };
})(TimerAndSecret);
