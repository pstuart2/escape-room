package api

import (
	"time"

	"github.com/globalsign/mgo/bson"

	"github.com/globalsign/mgo"
)

func checkForRunningGame() {
	db := masterSession.Copy()
	defer db.Close()

	runningGame := findRunningGame(Games(db))
	if runningGame == nil {
		return
	}

	startTimer(runningGame.ID)
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

	game := findById(games, id)

	switch game.State {
	case Paused:
		pauseTick(games, game)
		break
	case Running:
		runningTick(games, game)
		break
	}
}

func pauseTick(games *mgo.Collection, game *Game) {
	log.Infof("pauseTick for game %s", game.Name)
	game = updateGame(games, game.ID, bson.M{"$inc": bson.M{"time.pausedSeconds": 1}})
}

func runningTick(games *mgo.Collection, game *Game) {
	log.Infof("runningTick for game %s", game.Name)
	game = updateGame(games, game.ID, bson.M{"$inc": bson.M{"time.gameRunningSeconds": 1}})
}
