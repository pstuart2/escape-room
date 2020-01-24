package game

import (
	"time"

	"github.com/sirupsen/logrus"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
)

type State uint

const (
	Pending State = iota
	Starting
	Running
	Paused
	Finished
)

type Game struct {
	ID        string      `bson:"_id,omitempty" json:"id"`
	CreatedAt time.Time   `bson:"createdAt" json:"createdAt"`
	Name      string      `bson:"name" json:"name"`
	State     State       `bson:"state" json:"state"`
	Time      RunningInfo `bson:"time" json:"time"`
	Data      Data        `bson:"data" json:"data"`
}

type RunningInfo struct {
	StartedAt          time.Time `bson:"startedAt" json:"startedAt"`
	StartingInSeconds  uint32    `bson:"startingInSeconds" json:"startingInSeconds"`
	GameRunningSeconds uint32    `bson:"gameRunningSeconds" json:"gameRunningSeconds"`
	PausedSeconds      uint32    `bson:"pausedSeconds" json:"pausedSeconds"`
}

var fields = bson.M{
	"_id":       1,
	"createdAt": 1,
	"name":      1,
	"state":     1,
	"time":      1,
	"data":      1,
}

func FindById(games *mgo.Collection, id string) *Game {
	var game Game

	if err := games.Find(bson.M{"_id": id}).Select(fields).One(&game); err != nil {
		logrus.Errorf("Failed to get game: %v", err)
		return nil
	}

	return &game
}

func Games(s *mgo.Session) *mgo.Collection {
	return s.DB("").C("games")
}

func FindRunning(games *mgo.Collection) *Game {
	var game Game

	if err := games.Find(bson.M{"$and": []bson.M{{"state": bson.M{"$ne": Pending}}, {"state": bson.M{"$ne": Finished}}}}).Select(fields).One(&game); err != nil {
		logrus.Errorf("Failed to get game: %v", err)
		return nil
	}

	return &game
}

func Update(games *mgo.Collection, id string, expectedState State, update interface{}) *Game {
	change := mgo.Change{
		Update:    update,
		Upsert:    false,
		ReturnNew: true,
	}
	var game Game

	_, err := games.Find(bson.M{"_id": id, "state": expectedState}).Apply(change, &game)
	if err != nil {
		return nil
	}

	return &game
}

func SetMessage(games *mgo.Collection, id string, message string, seconds int) *Game {
	return Update(games, id, Running, bson.M{"$set": bson.M{"data.keys": []string{}, "data.message": message, "data.messageSecondsLeft": seconds}})
}
