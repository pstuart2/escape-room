import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../../api/game.js';

// App component - represents the whole app
class App extends Component {

    // handleSubmit( event ) {
    //     event.preventDefault();
    //
    //     // Find the text field via the React ref
    //     const text = ReactDOM.findDOMNode( this.refs.textInput ).value.trim();
    //
    //     Tasks.insert( {
    //         text, createdAt: new Date(), // current time
    //     } );
    //
    //     // Clear form
    //     ReactDOM.findDOMNode( this.refs.textInput ).value = '';
    // }
    //
    // renderTasks() {
    //     return this.props.tasks.map( ( task ) => (<Task key={task._id} task={task}/>) );
    // }

    render() {
        return (
            <h1>App</h1>
        );
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired
};

export default createContainer( () => {
    return { tasks: Tasks.find( {} ).fetch() };
}, App );
