package api

import (
	"fmt"
	"net/http"
	"time"

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

	checkForRunningGame()

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

	game := updateGame(games, id, bson.M{"$set": bson.M{"state": Starting}})

	if game == nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": fmt.Sprintf("Game '%s' not found", id)})
		return
	}

	startTimer(id)

	timeout := time.After(5 * time.Second)
	select {
	case <-timeout:
		updateGame(games, id, bson.M{"$set": bson.M{"state": Running}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game started: %s", game.Name)})
}

func pause(c *gin.Context) {
	id, games := getGamePost(c)

	game := updateGame(games, id, bson.M{"$set": bson.M{"state": Paused}})

	if game == nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": fmt.Sprintf("Game '%s' not found", id)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game paused: %s", game.Name)})
}

func resume(c *gin.Context) {
	id, games := getGamePost(c)

	game := updateGame(games, id, bson.M{"$set": bson.M{"state": Running}})

	if game == nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": fmt.Sprintf("Game '%s' not found", id)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game resumed: %s", game.Name)})
}

func stop(c *gin.Context) {
	id, games := getGamePost(c)

	game := updateGame(games, id, bson.M{"$set": bson.M{"state": Finished}})

	if game == nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": fmt.Sprintf("Game '%s' not found", id)})
		return
	}

	stopTimer <- true

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game stopped: %s", game.Name)})
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
