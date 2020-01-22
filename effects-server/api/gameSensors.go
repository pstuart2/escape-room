package api

import (
	"escape-room/effects-server/game"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
)

type GameMotionPost struct {
	HasMotion int `json:"hasMotion"`
}

func motion(c *gin.Context) {
	var json GameMotionPost
	if err := c.ShouldBindJSON(&json); err != nil {
		log.Errorf("Error: %s", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("/motion = %d", json.HasMotion)
	c.JSON(http.StatusOK, gin.H{})

	db := c.MustGet("db").(*mgo.Session).Copy()

	go func() {
		defer db.Close()
		games := Games(db)
		g := game.FindRunning(games)
		if g == nil {
			return
		}

		game.OnMotionChange(g, games, json.HasMotion)
	}()
}

type GameDistancePost struct {
	Distance float64 `json:"distance"`
}

func distance(c *gin.Context) {
	var json GameDistancePost
	if err := c.ShouldBindJSON(&json); err != nil {
		log.Errorf("Error: %s", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("/distance = %f", json.Distance)
	c.JSON(http.StatusOK, gin.H{})

	db := c.MustGet("db").(*mgo.Session).Copy()

	go func() {
		defer db.Close()
		games := Games(db)
		g := game.FindRunning(games)
		if g == nil {
			return
		}

		game.OnDistanceChange(g, games, json.Distance)
	}()
}

type GameRFIDPost struct {
	ID   int64  `json:"id"`
	Text string `json:"text"`
}

func rfid(c *gin.Context) {
	var json GameRFIDPost
	if err := c.ShouldBindJSON(&json); err != nil {
		log.Errorf("Error: %s", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("/rfid = {id=%d, text=%s}", json.ID, json.Text)
	c.JSON(http.StatusOK, gin.H{})

	db := c.MustGet("db").(*mgo.Session).Copy()

	go func() {
		defer db.Close()
		games := Games(db)
		g := game.FindRunning(games)
		if g == nil {
			return
		}

		game.OnRfid(g, games, json.ID, json.Text)
	}()
}

type GameKeypadPost struct {
	Key string `json:"key"`
}

func keypad(c *gin.Context) {
	var json GameKeypadPost
	if err := c.ShouldBindJSON(&json); err != nil {
		log.Errorf("Error: %s", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("/keypad = {keySequence=%s}", json.Key)
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

		game.OnKeypad(g, games, json.Key)
	}()
}
