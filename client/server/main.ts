import { Meteor } from 'meteor/meteor'
import { Games } from '../imports/api/games'
import { Id } from '../imports/api/models'

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
  },

  pause(id: Id) {
    console.log(`pausing game ${id}`)
  },

  unPause(id: Id) {
    console.log(`unPause game ${id}`)
  },

  stop(id: Id) {
    console.log(`stopping game ${id}`)
  },
})
