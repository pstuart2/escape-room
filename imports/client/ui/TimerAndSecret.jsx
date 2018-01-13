import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Game, initialGame } from '../../api/game.js';
import moment from 'moment';
import Eyes from './Eyes';
import numeral from 'numeral';
import { EyesInteractState, GameState } from "../../api/game";
import StartingTimer from './StartingTimer';
import SummaryBar from './SummaryBar';
import ListeningText from './ListeningText';

const StateText = ({ hintText, img }) => {
    if (hintText.length === 0) {
        return null;
    }

    return (
        <div className="level hint-item">
            <div className="level-left">
                <div className="level-item">
                    <figure className="image is-64x64">
                        <img src={img}/>
                    </figure>
                </div>
                <div className="level-item">
                    <div className="has-text-grey-dark hint-text">{hintText}</div>
                </div>
            </div>
        </div>
    );
};

class TimerAndSecret extends Component {


    render() {
        const { game, clock, players, hours, minutes, seconds, gameState, hintText } = this.props;

        if (!game || !game._id) {
            return null;
        }

        if ( gameState === GameState.Pending ) {
            return <div id="secret"/>
        }

        if ( gameState === GameState.Starting ) {
            return <StartingTimer game={game}/>
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
                            <p className="heading">Time</p>
                            <p className="title">{moment(game.time.current).format('h:mm:ss A')}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Clock</p>
                            <p className="title">{numeral(clock.hour).format('00')}:{numeral(clock.min).format('00')}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Game Time</p>
                            <p className="title">{hours}:{numeral(minutes).format('00')}:{numeral(seconds).format('00')}</p>
                        </div>
                    </div>
                </nav>

                {gameState === GameState.Finished ? <SummaryBar game={game}/> : <Eyes eyes={game.eyes} gameId={game._id} />}
                {game.eyes.interact !== EyesInteractState.AfraidOfDark && <ListeningText camera={game.camera}/>}

                <StateText hintText={game.say} img="/icon-text-bubble.png"/>

                <StateText hintText={hintText} img="/light-bulb.png"/>



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
    hintText: PropTypes.string.isRequired,
    clock: PropTypes.object.isRequired,
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
        clock: time.clock,
        gameState: state,
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
        isRunning: time.isRunning,
        hintText
    };
})(TimerAndSecret);
