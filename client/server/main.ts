import { Meteor } from 'meteor/meteor'
import { Games } from '../imports/api/games'
import { Id } from '../imports/api/models'
import { HTTP } from 'meteor/http'

Meteor.startup(() => {})

Meteor.publish('gameList', function() {
  return Games.find(
    {},
    {
      fields: { _id: 1, name: 1, createdAt: 1 },
    },
  )
})

Meteor.publish('game', (_id: Id) => {
  return Games.find({ _id })
})

Meteor.methods({
  start(id: Id) {
    HTTP.call('POST', 'http://localhost:3030/start', { data: { id } })
  },

  pause(id: Id) {
    HTTP.call('POST', 'http://localhost:3030/pause', { data: { id } })
  },

  resume(id: Id) {
    HTTP.call('POST', 'http://localhost:3030/resume', { data: { id } })
  },

  stop(id: Id) {
    HTTP.call('POST', 'http://localhost:3030/stop', { data: { id } })
  },
})
