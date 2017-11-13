import React from 'react';
import { Route, Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './ui/App';
import TimerAndSecret from './ui/TimerAndSecret';
import Control from './ui/Control';
import Players from './ui/Players';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <div>
            <Route exact path="/" component={App}/>
            <Route exact path="/secret" component={TimerAndSecret}/>
            <Route exact path="/control" component={Control}/>
            <Route exact path="/players" component={Players}/>
        </div>
    </Router>
);