import React, { Component } from 'react';
import { Game } from '../../api/game.js';

class QuestionRow extends Component {
    onQuestionChange(e) {
        const { game, index } = this.props;
        const key = `questions.${index}.q`;
        const setValue = {};
        setValue[ key ] = e.target.value;

        Game.update({ _id: game._id }, { '$set': setValue });
    }

    onAnswerChange(e) {
        const { game, index } = this.props;
        const key = `questions.${index}.a`;
        const setValue = {};
        setValue[ key ] = e.target.value;

        Game.update({ _id: game._id }, { '$set': setValue });
    }

    onHintChange(e) {
        const { game, index } = this.props;
        const key = `questions.${index}.h`;
        const setValue = {};
        setValue[ key ] = e.target.value;

        Game.update({ _id: game._id }, { '$set': setValue });
    }

    render() {
        const { question, index } = this.props;

        return (
            <div className="columns">
                <div className="column is-4">
                    <div className="field">
                        <label className="label">Question {index + 1}</label>
                        <div className="control">
                            <input value={question.q} onChange={this.onQuestionChange.bind(this)} className="input"
                                   type="text"/>
                        </div>
                    </div>
                </div>
                <div className="column is-4">
                    <div className="field">
                        <label className="label">Answer {index + 1}</label>
                        <div className="control">
                            <input value={question.a} onChange={this.onAnswerChange.bind(this)} className="input"
                                   type="text"/>
                        </div>
                    </div>
                </div>
                <div className="column is-4">
                    <div className="field">
                        <label className="label">Placeholder {index + 1}</label>
                        <div className="control">
                            <input value={question.h} onChange={this.onHintChange.bind(this)} className="input"
                                   type="text"/>
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
                {game.questions.map((q, i) => <QuestionRow game={game} key={i} index={i} question={q}/>)}
            </div>
        );
    }
}

Questions.propTypes = {};
