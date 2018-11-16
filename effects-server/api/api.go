package api

import (
	"escape-room/effects-server/game"
	"fmt"
	"net/http"

	"github.com/sirupsen/logrus"

	"github.com/globalsign/mgo/bson"

	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
)

var masterSession *mgo.Session
var stopTimer chan bool
var log *logrus.Entry

func SetUp(dbSession *mgo.Session) *gin.Engine {
	log = logrus.WithField("component", "api")

	masterSession = dbSession
	stopTimer = make(chan bool)

	r := gin.Default()

	r.Use(db(dbSession))

	r.POST("/start", start)
	r.POST("/pause", pause)
	r.POST("/resume", resume)
	r.POST("/stop", stop)

	checkAndResumeRunningGame()

	return r
}

type GameIdPost struct {
	Id string `json:"id" binding:"required"`
}

func db(dbSession *mgo.Session) gin.HandlerFunc {
	return func(c *gin.Context) {
		session := dbSession.Copy()
		defer session.Close()

		c.Set("games", Games(session))

		c.Next()
	}
}

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

	game.OnPause(g)

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game paused: %s", g.Name)})
}

func resume(c *gin.Context) {
	id, games := getGamePost(c)

	g := game.Update(games, id, game.Paused, bson.M{"$set": bson.M{"state": game.Running}})

	if g == nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": fmt.Sprintf("Game '%s' not found", id)})
		return
	}

	game.OnResume(g)

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

	game.OnStop(g)

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game stopped: %s", g.Name)})
}

func getGamePost(c *gin.Context) (string, *mgo.Collection) {
	var json GameIdPost
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return "", nil
	}

	games := c.MustGet("games").(*mgo.Collection)

	return json.Id, games
}
