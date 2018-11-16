import * as React from 'react'
import { Route, Router, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { App } from './App'
import { GameRoutes } from './GameRoutes'
import { Dashboard } from './Dashboard'

const browserHistory = createBrowserHistory()

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/:id/dashboard" component={Dashboard} />
      <Route path="/:id" component={GameRoutes} />
    </Switch>
  </Router>
)
