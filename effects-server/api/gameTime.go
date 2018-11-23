package api

import (
	"escape-room/effects-server/game"
	"time"

	"github.com/globalsign/mgo/bson"

	"github.com/globalsign/mgo"
)

func checkAndResumeRunningGame() {
	db := masterSession.Copy()
	defer db.Close()

	runningGame := game.FindRunning(Games(db))
	if runningGame == nil {
		return
	}

	startTimer(runningGame.ID)
	game.Init(runningGame)
}

func startTimer(id string) {
	log.Infof("Starting timer for game %s", id)

	go func() {
		tick := time.Tick(1000 * time.Millisecond)
		for {
			select {
			case <-tick:
				gameTick(id)
				break
			case <-stopTimer:
				return
			}
		}
	}()
}

func gameTick(id string) {
	db := masterSession.Copy()
	defer db.Close()

	games := Games(db)

	g := game.FindById(games, id)

	switch g.State {
	case game.Starting:
		startingTick(games, g)
		break
	case game.Paused:
		pauseTick(games, g)
		break
	case game.Running:
		runningTick(games, g)
		break
	}
}

func startingTick(games *mgo.Collection, g *game.Game) {
	log.Infof("startingTick for game %s", g.Name)

	if g.Time.StartingInSeconds == 1 {
		g = game.Update(games, g.ID, game.Starting, bson.M{"$inc": bson.M{"time.startingInSeconds": -1}, "$set": bson.M{"state": game.Running}})
		game.OnStart(g, games)
	} else {
		g = game.Update(games, g.ID, game.Starting, bson.M{"$inc": bson.M{"time.startingInSeconds": -1}})
		game.OnStartingTick(g, games)
	}
}

func runningTick(games *mgo.Collection, g *game.Game) {
	if g.State != game.Running {
		return
	}

	log.Infof("runningTick for game %s", g.Name)
	g = game.Update(games, g.ID, game.Running, bson.M{"$inc": bson.M{"time.gameRunningSeconds": 1}})

	game.OnRunningTick(g, games)
}

func pauseTick(games *mgo.Collection, g *game.Game) {
	log.Infof("pauseTick for game %s", g.Name)
	g = game.Update(games, g.ID, game.Paused, bson.M{"$inc": bson.M{"time.pausedSeconds": 1}})

	game.OnPauseTick(g, games)
}
