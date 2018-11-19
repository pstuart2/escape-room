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
