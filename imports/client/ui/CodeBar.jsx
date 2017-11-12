import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { key } from '../../api/game';

export default class CodeBar extends Component {

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
        const { finalCode } = this.props;
        const nextPos = this.state.codeIndex + 1;
        if ( nextPos > finalCode.length - 1 ) {
            this.setState({ codeIndex: 0 });
        } else {
            this.setState({ codeIndex: nextPos });
        }
    }

    render() {
        const { finalCode } = this.props;

        const finalCodes = finalCode.split('');
        const codeChar = finalCodes[ this.state.codeIndex ];
        const code = key[ codeChar ].split('');

        return (
            <div>
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
                        return <div key={i} className={`column pos ${cName}`}/>
                    })

                    }
                </div>
            </div>
        );
    }
}

CodeBar.propTypes = {
    finalCode: PropTypes.string.isRequired,
};
