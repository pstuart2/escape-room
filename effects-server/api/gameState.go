package api

import (
	"escape-room/effects-server/game"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo/bson"
)

func start(c *gin.Context) {
	id, games := getGamePost(c)

	runningGame := game.FindRunning(games)
	if runningGame != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": fmt.Sprintf("Game '%s' is already running", runningGame.Name)})
		return
	}

	g := game.Update(games, id, game.Pending, bson.M{"$set": bson.M{"state": game.Starting, "time.startingInSeconds": 10}})

	if g == nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": fmt.Sprintf("Game '%s' not found", id)})
		return
	}

	game.OnStarting(g)

	startTimer(id)

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game started: %s", g.Name)})
}

func pause(c *gin.Context) {
	id, games := getGamePost(c)

	g := game.Update(games, id, game.Running, bson.M{"$set": bson.M{"state": game.Paused}})

	if g == nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": fmt.Sprintf("Game '%s' not found", id)})
		return
	}

	game.OnPause(g, games)

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game paused: %s", g.Name)})
}

func resume(c *gin.Context) {
	id, games := getGamePost(c)

	g := game.Update(games, id, game.Paused, bson.M{"$set": bson.M{"state": game.Running}})

	if g == nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": fmt.Sprintf("Game '%s' not found", id)})
		return
	}

	game.OnResume(g, games)

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game resumed: %s", g.Name)})
}

func stop(c *gin.Context) {
	id, games := getGamePost(c)

	g := game.Update(games, id, game.Running, bson.M{"$set": bson.M{"state": game.Finished}})

	if g == nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": fmt.Sprintf("Game '%s' not found", id)})
		return
	}

	stopTimer <- true

	game.OnStop(g, games)

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game stopped: %s", g.Name)})
}
