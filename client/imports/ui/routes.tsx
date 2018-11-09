import * as React from 'react'
import { Route, Router } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { App } from './App'
import { GameView } from './GameView'
import { Players } from './Players'

const browserHistory = createBrowserHistory()

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <>
      <Route exact path="/" component={App} />
      <Route exact path="/:id" component={GameView} />
      <Route exact path="/:id/players" component={Players} />
    </>
  </Router>
)
