import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListeningState } from '../../api/game';

export default class ListeningText extends Component {
    constructor(props) {
        super(props);

        this.getImage = this.getImage.bind(this);
    }

    getImage() {
        const state = this.props.camera.listeningState;
        switch(state) {
            case ListeningState.Listening: {
                return "/icon/listening.png";
            }

            case ListeningState.Fetching: {
                return "/icon-decoding.png";
            }

            case ListeningState.Success: {
                return "/icon-text-bubble.png";
            }

            case ListeningState.Failed: {
                return "/icon-did-not-hear.png";
            }
        }
    }

    render() {
        const { camera } = this.props;

        if (camera.listeningState === ListeningState.None) {
            return null;
        }

        return (
            <div className="level hint-item">
                <div className="level-left">
                    <div className="level-item">
                        <figure className="image is-64x64">
                            <img src={this.getImage()}/>
                        </figure>
                    </div>
                    <div className="level-item">
                        <div className="has-text-grey-dark hint-text">{camera.text}</div>
                    </div>
                </div>
            </div>
        );
    }
}

ListeningText.propTypes = {
    camera: PropTypes.object.isRequired
};