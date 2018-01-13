import React, { Component } from 'react';
import { Game } from '../../api/game.js';

class QuestionRow extends Component {
    constructor( props ) {
        super( props );

        this.onAsk = this.onAsk.bind( this );
        this.onAnswer = this.onAnswer.bind( this );
    }

    onQuestionChange( e ) {
        const { game, index } = this.props;
        const key = `questions.${index}.question`;
        const setValue = {};
        setValue[ key ] = e.target.value;

        Game.update( { _id: game._id }, { '$set': setValue } );
    }

    onAnswerChange( e ) {
        const { game, index } = this.props;
        const key = `questions.${index}.answer`;
        const setValue = {};
        setValue[ key ] = e.target.value;

        Game.update( { _id: game._id }, { '$set': setValue } );
    }

    onRewardChange( e ) {
        const { game, index } = this.props;
        const key = `questions.${index}.reward`;
        const setValue = {};
        setValue[ key ] = e.target.value;

        Game.update( { _id: game._id }, { '$set': setValue } );
    }

    onAsk() {
        const { index } = this.props;
        Meteor.call( 'ask', index )
    }

    onAnswer() {
        const { index } = this.props;
        Meteor.call( 'answer', index )
    }

    render() {
        const { question, index } = this.props;

        return (
            <div className="columns">
                <div className="column is-3">
                    <div className="field">
                        <label className="label">Question {index + 1}</label>
                        <div className="control">
                            <input value={question.question} onChange={this.onQuestionChange.bind( this )}
                                   className="input"
                                   type="text"/>
                        </div>
                    </div>
                </div>
                <div className="column is-3">
                    <div className="field">
                        <label className="label">Answer {index + 1}</label>
                        <div className="control">
                            <input value={question.answer} onChange={this.onAnswerChange.bind( this )} className="input"
                                   type="text"/>
                        </div>
                    </div>
                </div>
                <div className="column is-3">
                    <div className="field">
                        <label className="label">Reward {index + 1}</label>
                        <div className="control">
                            <input value={question.reward} onChange={this.onRewardChange.bind( this )} className="input"
                                   type="text"/>
                        </div>
                    </div>
                </div>
                <div className="column is-1">
                    <div className="field">
                        <label className="label">&nbsp;</label>
                        <div className="control">
                            {!question.asked && <button className="button is-primary" onClick={this.onAsk}>Ask</button>}
                        </div>
                    </div>
                </div>
                <div className="column is-1">
                    <div className="field">
                        <label className="label">&nbsp;</label>
                        <div className="control">
                            {!question.answered &&
                            <button className="button is-info" onClick={this.onAnswer}>Answer</button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default class Questions extends Component {

    render() {
        const { game } = this.props;
        return (
            <div id="questions">
                {game.questions.map( ( q, i ) => <QuestionRow game={game} key={i} index={i} question={q}/> )}
            </div>
        );
    }
}

Questions.propTypes = {};
