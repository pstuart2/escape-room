import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Game, initialGame } from '../../api/game.js';

const Success = ({index, question}) => {
    return (
        <div className="columns is-multiline">
            <div className="column is-12">
                Question {index + 1}: <span className="tag is-success">Correct!</span>
            </div>
            <div className="column is-12 answer">
                <table className="table">
                    <tbody>
                    {question.r.map(v => <tr key={v.key}><td>{v.key}</td><td>=</td><td>{v.value}</td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


class AnswerRow extends Component {
    handleSubmit(e) {
        e.preventDefault();
        const {index} = this.props;
        Meteor.call('answer', index, this.refs.answer.value);
    }

    render() {
        const {index, question} = this.props;
        if (question.r) {
            return <Success index={index} question={question} />
        }

        return (
            <div className="columns is-multiline">
                <div className="column is-12">
                    <label className="label">{index + 1}: {question.q}</label>
                </div>
                <div className="column is-10">
                    <input className="input" type="text" ref="answer" placeholder={question.h}/>
                </div>
                <div className="column is-2">
                    <button className="button is-success" onClick={this.handleSubmit.bind(this)}>Submit</button>
                </div>
            </div>
        );
    }
}

class Answers extends Component {

    render() {
        const {game} = this.props;

        return (
            <div id="answers" className="container is-fluid" style={{marginTop: 10}}>
                {game.questions.map((q,i) => <AnswerRow key={i} index={i} question={q} />)}
            </div>
        );
    }
}


export default withTracker(() => {
    Meteor.subscribe('questions');
    const game = Game.findOne({}) || initialGame();

    return {
        game
    };
})(Answers);
