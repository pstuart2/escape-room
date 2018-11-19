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
    try {
      HTTP.call('POST', 'http://localhost:3030/start', { data: { id } })
    } catch (e) {
      return {
        statusCode: e.response.statusCode,
        data: e.response.data,
      }
    }
  },

  pause(id: Id) {
    try {
      HTTP.call('POST', 'http://localhost:3030/pause', { data: { id } })
    } catch (e) {
      return {
        statusCode: e.response.statusCode,
        data: e.response.data,
      }
    }
  },

  resume(id: Id) {
    try {
      HTTP.call('POST', 'http://localhost:3030/resume', { data: { id } })
    } catch (e) {
      return {
        statusCode: e.response.statusCode,
        data: e.response.data,
      }
    }
  },

  stop(id: Id) {
    try {
      HTTP.call('POST', 'http://localhost:3030/stop', { data: { id } })
    } catch (e) {
      return {
        statusCode: e.response.statusCode,
        data: e.response.data,
      }
    }
  },
})
