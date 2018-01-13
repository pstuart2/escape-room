import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Game, GameState, initialGame } from '../../api/game.js';
import Questions from './Questions';
import { Link } from 'react-router-dom';
import { EyeState } from '../../eyes/animations';

class Control extends Component {
    constructor( props ) {
        super( props );

        this.changeEyes = this.changeEyes.bind( this );
        this.resetClock = this.resetClock.bind( this );
        this.setAsCurrentGame = this.setAsCurrentGame.bind( this );
    }

    resetClock() {
        const { game } = this.props;
        Game.update( { _id: game._id }, { '$set': { 'time.clock': { hour: 0, min: 0 } } } );
    }

    setAsCurrentGame() {
        const { game } = this.props;
        Meteor.call( 'setGameId', game._id );
    }

    onNameChange( e ) {
        const { game } = this.props;
        Game.update( { _id: game._id }, { '$set': { name: e.target.value } } );
    }

    onInstructionsChange( e ) {
        const { game } = this.props;
        Game.update( { _id: game._id }, { '$set': { instructions: e.target.value } } );
    }

    onMessageChange( e ) {
        const { game } = this.props;
        Game.update( { _id: game._id }, { '$set': { hintText: e.target.value } } )
    }

    onSayChange( e ) {
        const { game } = this.props;
        Game.update( { _id: game._id }, { '$set': { 'say': e.target.value } } )
    }

    onShutdownCodeChange( e ) {
        const { game } = this.props;
        Game.update( { _id: game._id }, { '$set': { shutdownCode: e.target.value.toLowerCase() } } )
    }

    changeEyes( eyeState ) {
        const { game } = this.props;
        Game.update( { _id: game._id }, { '$set': { 'eyes.state': eyeState } } )
    }

    start() {
        const { game } = this.props;
        Meteor.call( 'start', game._id );
    }

    pause() {
        const { game } = this.props;
        Meteor.call( 'pause', game._id );
    }

    resume() {
        const { game } = this.props;
        Meteor.call( 'resume', game._id );
    }


    finish() {
        const { game } = this.props;
        Meteor.call( 'finish', game._id );
    }

    wallLightsOnly() {
        const { game } = this.props;
        Meteor.call( 'wallLightsOnly', game._id );

    }

    gameRoomLightsOnly() {
        const { game } = this.props;
        Meteor.call( 'gameRoomLightsOnly', game._id );
    }

    lightsOn() {
        const { game } = this.props;
        Meteor.call( 'lightsOn', game._id );
    }

    lightsOff() {
        const { game } = this.props;
        Meteor.call( 'lightsOff', game._id );
    }

    renderControlButton( game ) {
        switch ( game.state ) {
            case GameState.Pending:
                return <button onClick={this.start.bind( this )} className="button is-success">Start</button>;

            case GameState.Running:
                return <button onClick={this.pause.bind( this )} className="button is-warning">Pause</button>;

            case GameState.Paused:
                return <button onClick={this.resume.bind( this )} className="button is-success">Resume</button>;
        }
    }

    renderEndButton( game ) {
        switch ( game.state ) {
            case GameState.Running:
                return <button onClick={this.finish.bind( this )} className="button is-danger">Finish</button>;
        }

        return <Link to="/list" className="button">Game List</Link>;
    }

    render() {
        const { game } = this.props;
        const { speed } = game.time;


        return (
            <div id="control" className="container is-fluid">
                <div className="columns">
                    <div className="column">
                        {this.renderControlButton( game )}
                    </div>
                    <div className="column">
                        <button className="button" onClick={this.setAsCurrentGame}>Current Game</button>
                    </div>
                    <div className="column">
                        <button className="button" onClick={this.resetClock}>Reset Clock</button>
                    </div>
                    <div className="column">
                        <button className="button is-light" onClick={this.lightsOn.bind( this )}>Lights On</button>
                    </div>
                    <div className="column">
                        <button className="button is-dark" onClick={this.wallLightsOnly.bind( this )}>Wall Lights
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-info" onClick={this.gameRoomLightsOnly.bind( this )}>Game Room
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-black" onClick={this.lightsOff.bind( this )}>Lights Off</button>
                    </div>
                    <div className="column">
                        <Link to={`/${game._id}/players`} className="button is-primary">Players</Link>
                    </div>
                    <div className="column">
                        {this.renderEndButton( game )}
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <button className="button" onClick={() => this.changeEyes( EyeState.NORMAL )}>NORMAL</button>
                    </div>
                    <div className="column">
                        <button className="button is-light" onClick={() => this.changeEyes( EyeState.EYES_DOWN )}>DOWN
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-light" onClick={() => this.changeEyes( EyeState.EYES_UP )}>UP
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-light"
                                onClick={() => this.changeEyes( EyeState.EYES_RIGHT )}>RIGHT
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-light" onClick={() => this.changeEyes( EyeState.EYES_LEFT )}>LEFT
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-primary"
                                onClick={() => this.changeEyes( EyeState.EYES_ROLL )}>ROLL
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-primary"
                                onClick={() => this.changeEyes( EyeState.EYES_SURPRISED )}>SURPRISED
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-info" onClick={() => this.changeEyes( EyeState.HIDE_LEFT )}>HIDE
                            LEFT
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-info" onClick={() => this.changeEyes( EyeState.HIDE_RIGHT )}>HIDE
                            RIGHT
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-success" onClick={() => this.changeEyes( EyeState.YES )}>YES
                        </button>
                    </div>
                    <div className="column">
                        <button className="button is-danger" onClick={() => this.changeEyes( EyeState.NO )}>NO</button>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input value={`${game.name}`} onChange={this.onNameChange.bind( this )}
                               className="input"
                               type="text" placeholder="Name of the game"/>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Instructions</label>
                    <div className="control">
                        <textarea className="input" value={game.instructions} onChange={this.onInstructionsChange.bind( this )} />
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">Bottom Message</label>
                            <div className="control">
                                <input value={game.hintText} onChange={this.onMessageChange.bind( this )}
                                       className="input"
                                       type="text" placeholder="Hint text"/>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label">Say</label>
                            <div className="control">
                                <input value={`${game.say}`} onChange={this.onSayChange.bind( this )} className="input"
                                       type="text"/>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label">Shutdown Code</label>
                            <div className="control">
                                <input value={game.shutdownCode} onChange={this.onShutdownCodeChange.bind( this )}
                                       className="input"
                                       type="text" placeholder="Shutdown Code"/>
                            </div>
                        </div>
                    </div>
                </div>


                <Questions game={game}/>
            </div>
        );
    }
}


export default withTracker( ( { match } ) => {
    Meteor.subscribe( 'game', match.params.id );
    const game = Game.findOne( { _id: match.params.id } ) || initialGame();

    return {
        game
    };
} )( Control );
