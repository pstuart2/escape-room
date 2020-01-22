package game

import (
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/sirupsen/logrus"
)

var log *logrus.Entry

func OnInit(g *Game, games *mgo.Collection) {
	log = logrus.WithFields(logrus.Fields{
		"component": "game",
		"gameId":    g.ID,
	})
}

func OnStarting(g *Game, games *mgo.Collection) {
	OnInit(g, games)
}

func OnStartingTick(g *Game, games *mgo.Collection) {

}

func OnStart(g *Game, games *mgo.Collection) {

}

func OnRunningTick(g *Game, games *mgo.Collection) {

}

func OnPause(g *Game, games *mgo.Collection) {

}

func OnPauseTick(g *Game, games *mgo.Collection) {

}

func OnResume(g *Game, games *mgo.Collection) {

}

func OnStop(g *Game, games *mgo.Collection) {
}

func OnMotionChange(g *Game, games *mgo.Collection, hasMotion int) {

}

func OnDistanceChange(g *Game, games *mgo.Collection, distance float64) {

}

func OnRfid(g *Game, games *mgo.Collection, id int64, text string) {

}

func OnKeypad(g *Game, games *mgo.Collection, key string) {
	log.Infof("Handling key %s", key)

	switch key {
	case "#":
		log.Infof("Submitting Keys: %v", g.Data.Keys)
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}}})

	case "*":
		if len(g.Data.Keys) > 0 {
			keys := g.Data.Keys[:len(g.Data.Keys)-1]
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": keys}})
		}

	default:
		keys := append(g.Data.Keys, key)

		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": keys}})
	}
}
