import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        const { finalCodes } = this.props;
        const nextPos = this.state.codeIndex + 1;
        if ( nextPos > finalCodes.length - 1 ) {
            this.setState({ codeIndex: 0 });
        } else {
            this.setState({ codeIndex: nextPos });
        }
    }

    render() {
        const { finalCodes } = this.props;

        const code = finalCodes[ this.state.codeIndex ];

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
    finalCodes: PropTypes.array.isRequired,
};
