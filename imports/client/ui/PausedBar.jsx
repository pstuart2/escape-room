import React, { Component } from 'react';

export default class PausedBar extends Component {

    render() {

        return (
            <div className="columns paused">
                <div className="column has-text-centered">
                    <h1 className="title">P</h1>
                </div>
                <div className="column has-text-centered">
                    <h1 className="title">A</h1>
                </div>
                <div className="column has-text-centered">
                    <h1 className="title">U</h1>
                </div>
                <div className="column has-text-centered">
                    <h1 className="title">S</h1>
                </div>
                <div className="column has-text-centered">
                    <h1 className="title">E</h1>
                </div>
            </div>
        );
    }
}

PausedBar.propTypes = {};
