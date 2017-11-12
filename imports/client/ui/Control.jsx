import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Game } from '../../api/game.js';
import { GameState, initialGame } from "../../api/game";
import moment from 'moment';

class Control extends Component {

    onMessageChange(e) {
        const { game } = this.props;
        Game.update({ _id: game._id }, { '$set': { hintText: e.target.value } })
    }

    onSecondsLeftChange(e) {
        const { game } = this.props;
        Game.update({ _id: game._id }, { '$set': { 'time.secondsLeft': parseInt(e.target.value) || 0 } })
    }

    onSpeedChange(e) {
        const { game } = this.props;
        Game.update({ _id: game._id }, { '$set': { 'time.speed': parseInt(e.target.value) } })
    }

    onFinalCodeChange(e) {
        const { game } = this.props;
        Game.update({ _id: game._id }, { '$set': { finalCode: e.target.value.toLowerCase() } })
    }

    renderControlButton(game) {
        switch ( game.state ) {
            case GameState.Pending:
                return <button className="button is-success">Start</button>;

            case GameState.Running:
                return <button className="button is-warning">Pause</button>;

            case GameState.Paused:
                return <button className="button is-success">Resume</button>;
        }
    }

    render() {
        const { game } = this.props;
        const { secondsLeft, speed } = game.time;

        const duration = moment.duration(secondsLeft, 'seconds');

        return (
            <div id="control" className="container is-fluid">
                <div className="columns">
                    <div className="column">
                        {this.renderControlButton(game)}
                    </div>
                    <div className="column">
                        <button className="button is-light">Lights On</button>
                    </div>
                    <div className="column">
                        <button className="button is-black">Lights Off</button>
                    </div>
                    <div className="column">
                        <button className="button is-danger">Reset Game</button>
                    </div>
                </div>


                <div className="field">
                    <label className="label">Bottom Message</label>
                    <div className="control">
                        <input value={game.hintText} onChange={this.onMessageChange.bind(this)} className="input"
                               type="text" placeholder="Hint text"/>
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">Game
                                Seconds {`${duration.hours()}:${duration.minutes()}:${duration.seconds()}`}</label>
                            <div className="control">
                                <input value={`${secondsLeft}`} onChange={this.onSecondsLeftChange.bind(this)}
                                       className="input"
                                       type="number" placeholder="Seconds Left"/>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label">Speed</label>
                            <div className="control">
                                <input value={`${speed}`} onChange={this.onSpeedChange.bind(this)} className="input"
                                       type="number" placeholder="Game Speed"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Final Code</label>
                    <div className="control">
                        <input value={game.finalCode} onChange={this.onFinalCodeChange.bind(this)} className="input"
                               type="text" placeholder="Final Code"/>
                    </div>
                </div>
            </div>
        );
    }
}


export default withTracker(() => {
    const game = Game.findOne({}) || initialGame();

    return {
        game
    };
})(Control);
