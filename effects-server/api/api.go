package api

import (
	"escape-room/effects-server/game"
	"net/http"

	"github.com/sirupsen/logrus"

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

	r.POST("/motion", motion)
	r.POST("/distance", distance)
	r.POST("/rfid", rfid)
	r.POST("/keypad", keypad)

	r.POST("/movefloor", moveFloor)

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

		c.Set("db", session)
		c.Set("games", Games(session))

		c.Next()
	}
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

type MoveFloorPost struct {
	Floors int `json:"floors"`
}

func moveFloor(c *gin.Context) {
	var json MoveFloorPost
	if err := c.ShouldBindJSON(&json); err != nil {
		log.Errorf("Error: %s", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("/movefloor = {keySequence=%s}", json.Floors)
	c.JSON(http.StatusOK, gin.H{})

	db := c.MustGet("db").(*mgo.Session).Copy()

	go func() {
		defer db.Close()
		games := Games(db)
		g := game.FindRunning(games)
		if g == nil {
			log.Printf("Game is nil")
			return
		}

		game.OnChangeFloor(g, games, json.Floors)
	}()
}
