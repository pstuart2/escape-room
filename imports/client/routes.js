import React from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './ui/App';
import TimerAndSecret from "./ui/TimerAndSecret";

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <div>
            <Route exact path="/" component={App}/>
            <Route exact path="/secret" component={TimerAndSecret}/>
        </div>
    </Router>
);