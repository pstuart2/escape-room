import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Game, GameState, initialGame } from '../../api/game.js';
import Questions from './Questions';

class Control extends Component {

    onMessageChange(e) {
        const { game } = this.props;
        Game.update({ _id: game._id }, { '$set': { hintText: e.target.value } })
    }

    onSpeedChange(e) {
        const { game } = this.props;
        Game.update({ _id: game._id }, { '$set': { 'time.speed': parseInt(e.target.value) } })
    }

    onFinalCodeChange(e) {
        const { game } = this.props;
        Game.update({ _id: game._id }, { '$set': { finalCode: e.target.value.toLowerCase() } })
    }

    start() {
        Meteor.call('start');
    }

    pause() {
        Meteor.call('pause');
    }

    resume() {
        Meteor.call('resume');
    }

    reset() {
        // TODO: Add validation
        Meteor.call('reset');
    }

    finish() {
        Meteor.call('finish');
    }

    renderControlButton(game) {
        switch ( game.state ) {
            case GameState.Pending:
                return <button onClick={this.start.bind(this)} className="button is-success">Start</button>;

            case GameState.Running:
                return <button onClick={this.pause.bind(this)} className="button is-warning">Pause</button>;

            case GameState.Paused:
                return <button onClick={this.resume.bind(this)} className="button is-success">Resume</button>;
        }
    }

    renderEndButton(game) {
        switch ( game.state ) {
            case GameState.Running:
                return <button onClick={this.finish.bind(this)} className="button is-danger">Finish</button>;

            case GameState.Finished:
                return <button onClick={this.reset.bind(this)} className="button is-danger">Reset Game</button>;
        }

        return null;
    }

    render() {
        const { game } = this.props;
        const { speed } = game.time;


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
                        {this.renderEndButton(game)}
                    </div>
                </div>


                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">Bottom Message</label>
                            <div className="control">
                                <input value={game.hintText} onChange={this.onMessageChange.bind(this)}
                                       className="input"
                                       type="text" placeholder="Hint text"/>
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
                    <div className="column">
                        <div className="field">
                            <label className="label">Final Code</label>
                            <div className="control">
                                <input value={game.finalCode} onChange={this.onFinalCodeChange.bind(this)}
                                       className="input"
                                       type="text" placeholder="Final Code"/>
                            </div>
                        </div>
                    </div>
                </div>


                <Questions game={game}/>
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
