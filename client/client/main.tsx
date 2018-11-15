import * as React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import { renderRoutes } from '../imports/ui/routes'

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('react-target'))
})
