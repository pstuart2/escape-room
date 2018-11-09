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
