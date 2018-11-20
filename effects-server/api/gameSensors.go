package api

import (
	"escape-room/effects-server/game"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
)

type GameMotionPost struct {
	HasMotion int    `json:"hasMotion"`
	Direction string `json:"direction"`
}

func motion(c *gin.Context) {
	var json GameMotionPost
	if err := c.ShouldBindJSON(&json); err != nil {
		log.Errorf("Error: %s", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("/motion = {hasMotion=%d, direction:%s", json.HasMotion, json.Direction)
	c.JSON(http.StatusOK, gin.H{})

	db := c.MustGet("db").(*mgo.Session).Copy()

	go func() {
		defer db.Close()
		g := game.FindRunning(Games(db))
		if g != nil {
			return
		}

		game.OnMotionChange(g, json.HasMotion)
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
		g := game.FindRunning(Games(db))
		if g != nil {
			return
		}

		game.OnDistanceChange(g, json.Distance)
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
		g := game.FindRunning(Games(db))
		if g != nil {
			return
		}

		game.OnRfid(g, json.ID, json.Text)
	}()
}
