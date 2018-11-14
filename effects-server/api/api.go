package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
)

func SetUp(dbSession *mgo.Session) *gin.Engine {
	r := gin.Default()

	r.Use(db(dbSession))

	r.POST("/start", start)

	return r
}

type StartGame struct {
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
	// log := logrus.WithField("component", "api/start")
	var json StartGame
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	games := c.MustGet("games").(*mgo.Collection)
	game := findById(games, json.Id)

	if game == nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": fmt.Sprintf("not found: %s", json.Id)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("game started: %s", game.Name)})
}
