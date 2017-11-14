import React from 'react';
import { Route, Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import GameList from './ui/GameList';
import TimerAndSecret from './ui/TimerAndSecret';
import Control from './ui/Control';
import Players from './ui/Players';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <div>
            <Route exact path="/" component={GameList}/>
            <Route exact path="/:id/secret" component={TimerAndSecret}/>
            <Route exact path="/:id/control" component={Control}/>
            <Route exact path="/:id/players" component={Players}/>
        </div>
    </Router>
);