package api

import (
	"escape-room/effects-server/game"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
)

type GameMotionPost struct {
	HasMotion int `json:"hasMotion" binding:"required"`
}

func motion(c *gin.Context) {
	var json GameMotionPost
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{})

	go func() {
		games := c.MustGet("games").(*mgo.Collection)
		g := game.FindRunning(games)
		if g != nil {
			return
		}

		game.OnMotionChange(g, json.HasMotion)
	}()
}
