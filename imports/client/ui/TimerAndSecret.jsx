import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Game } from '../../api/game.js';

class TimerAndSecret extends Component {
    constructor(props) {
        super(props);
        this.state = { codeIndex: 0 };

        this.switchCode = this.switchCode.bind(this);
    }

    componentWillMount() {
        this.timeOut = setInterval(this.switchCode, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.timeOut);
    }

    switchCode() {
        const { finalCodes } = this.props;
        const nextPos = this.state.codeIndex + 1;
        if ( nextPos > finalCodes.length - 1 ) {
            this.setState({ codeIndex: 0 });
        } else {
            this.setState({ codeIndex: nextPos });
        }
    }

    render() {
        const { players, finalCodes } = this.props;
        const code = finalCodes[ this.state.codeIndex ];

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
                            <p className="heading">Hours</p>
                            <p className="title">0</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Minutes</p>
                            <p className="title">27</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Seconds</p>
                            <p className="title">33</p>
                        </div>
                    </div>
                </nav>

                <div className="columns binary">
                    <div className="column has-text-centered">
                        <h1 className="title">{code[ 0 ]}</h1>
                    </div>
                    <div className="column has-text-centered">
                        <h1 className="title">{code[ 1 ]}</h1>
                    </div>
                    <div className="column has-text-centered">
                        <h1 className="title">{code[ 2 ]}</h1>
                    </div>
                    <div className="column has-text-centered">
                        <h1 className="title">{code[ 3 ]}</h1>
                    </div>
                    <div className="column has-text-centered">
                        <h1 className="title">{code[ 4 ]}</h1>
                    </div>
                </div>

                <div className="columns">
                    {finalCodes.map((x, i) => {
                        const cName = i === this.state.codeIndex ? 'selected' : '';
                        return <div key={i} className={`column pos ${cName}`} />
                    })
                    }
                </div>
            </div>
        );
    }
}

TimerAndSecret.propTypes = {
    players: PropTypes.array.isRequired,
    finalCodes: PropTypes.array.isRequired
};

export default withTracker(() => {
    const game = Game.findOne({}) || {
        players: [],
        finalCodes: [ [ ' ', ' ', ' ', ' ', ' ' ] ]
    };

    const { players, finalCodes } = game;

    return {
        players,
        finalCodes
    };
})(TimerAndSecret);
