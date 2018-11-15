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
    // TODO: Send start game and send to effects server
    // TODO: Effects server will count down startingInSeconds so it is able to sync a countdown sound
    // TODO: Effects server will be responsible for counting game seconds
    console.log(`starting game ${id}`)
    HTTP.call('POST', 'http://localhost:3030/start', { data: { id } })
  },

  pause(id: Id) {
    console.log(`pausing game ${id}`)
    HTTP.call('POST', 'http://localhost:3030/pause', { data: { id } })
  },

  resume(id: Id) {
    console.log(`resume game ${id}`)
    HTTP.call('POST', 'http://localhost:3030/resume', { data: { id } })
  },

  stop(id: Id) {
    console.log(`stopping game ${id}`)
    HTTP.call('POST', 'http://localhost:3030/stop', { data: { id } })
  },
})
