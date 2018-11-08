import React from 'react';
import {Route, Router} from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import {App} from './App'

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <>
            <Route exact path="/" component={App}/>
        </>
    </Router>
);