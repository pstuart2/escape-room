import React, { Component } from 'react';
import { Game, initialGame } from '../../api/game.js';
import { withTracker } from 'meteor/react-meteor-data';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';

class PlayerRow extends Component {
    onNameChange(e) {
        if ( e.target.value.length > 15 ) {
            return;
        }
        const { game, index } = this.props;
        const key = `players.${index}.name`;
        const setValue = {};
        setValue[ key ] = e.target.value;

        Game.update({ _id: game._id }, { '$set': setValue });
    }

    onBdayChange(e) {
        if ( !e ) {
            e = moment();
        }

        const { game, index } = this.props;
        const key = `players.${index}.bday`;
        const setValue = {};
        setValue[ key ] = e.toDate();

        Game.update({ _id: game._id }, { '$set': setValue });
    }

    render() {
        const { index, player } = this.props;
        return (
            <div>
                <h3 className="title is-3" style={{ marginTop: 20, marginBottom: 5 }}>Player {index + 1}</h3>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">Gamer Tag</label>
                            <div className="control">
                                <input value={player.name} onChange={this.onNameChange.bind(this)} className="input"
                                       type="text"/>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label">Birthday</label>
                            <div className="control">
                                <DatePicker
                                    selected={moment(player.bday)}
                                    onChange={this.onBdayChange.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Players extends Component {
    addPlayer() {
        const { game } = this.props;
        Game.update({ _id: game._id }, { '$push': { players: { name: '', bday: new Date() } } })
    }

    render() {
        const { game } = this.props;
        return (
            <div id="players" className="container is-fluid">
                <div>
                    <Link to={`/${game._id}/control`} className="button is-primary">Control</Link>
                </div>
                {game.players.map((p, i) => <PlayerRow game={game} key={i} index={i} player={p}/>)}

                <div style={{ marginTop: 220 }}>
                    <button className="button is-success" onClick={this.addPlayer.bind(this)}>Add Player</button>
                </div>
            </div>
        );
    }
}

export default withTracker(({ match }) => {
    const game = Game.findOne({ _id: match.params.id }) || initialGame();

    return {
        game
    };
})(Players);
