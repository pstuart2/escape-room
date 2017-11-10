import React, {Component} from 'react';
import {Tasks} from '../../api/game.js';

// App component - represents the whole app
export default class App extends Component {

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
