package game

import "github.com/sirupsen/logrus"

var log *logrus.Entry

func OnStarting(g *Game) {
	log = logrus.WithFields(logrus.Fields{
		"component": "game",
		"gameId":    g.ID,
	})
}

func OnStartingTick(g *Game) {

}

func OnStart(g *Game) {

}

func OnRunningTick(g *Game) {

}

func OnPause(g *Game) {

}

func OnPauseTick(g *Game) {

}

func OnResume(g *Game) {

}

func OnStop(g *Game) {
}

func OnMotionChange(g *Game, hasMotion int) {

}

func OnDistanceChange(g *Game, distance float64) {

}
