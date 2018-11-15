package api

import (
	"time"

	"github.com/sirupsen/logrus"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
)

type GameState uint

const (
	Pending GameState = iota
	Starting
	Running
	Paused
	Finished
)

type Game struct {
	ID        string      `bson:"_id,omitempty" json:"id"`
	CreatedAt time.Time   `bson:"createdAt" json:"createdAt"`
	Name      string      `bson:"name" json:"name"`
	State     GameState   `bson:"state" json:"state"`
	Time      RunningInfo `bson:"time" json:"time"`
}

type RunningInfo struct {
	StartedAt          time.Time `bson:"startedAt" json:"startedAt"`
	StartingInSeconds  uint32    `bson:"startInSeconds" json:"startingInSeconds"`
	GameRunningSeconds uint32    `bson:"gameRunningSeconds" json:"gameRunningSeconds"`
	TimesPaused        uint8     `bson:"timesPaused" json:"timesPaused"`
}

func Games(s *mgo.Session) *mgo.Collection {
	return s.DB("").C("games")
}

func findById(games *mgo.Collection, id string) *Game {
	var game Game

	if err := games.Find(bson.M{"_id": id}).Select(bson.M{
		"_id":       1,
		"createdAt": 1,
		"name":      1,
		"state":     1,
		"time":      1,
	}).One(&game); err != nil {
		logrus.Errorf("Failed to get game: %v", err)
		return nil
	}

	return &game
}

func updateGame(games *mgo.Collection, id string, update interface{}) *Game {
	change := mgo.Change{
		Update:    update,
		Upsert:    false,
		ReturnNew: true,
	}
	var game Game

	_, err := games.Find(bson.M{"_id": id}).Apply(change, &game)
	if err != nil {
		return nil
	}

	return &game
}