package game

import (
	"bytes"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/sirupsen/logrus"
)

var log *logrus.Entry

func OnInit(g *Game, games *mgo.Collection) {
	log = logrus.WithFields(logrus.Fields{
		"component": "game",
		"gameId":    g.ID,
	})
}

func OnStarting(g *Game, games *mgo.Collection) {
	OnInit(g, games)
}

func OnStartingTick(g *Game, games *mgo.Collection) {

}

func OnStart(g *Game, games *mgo.Collection) {

}

func OnRunningTick(g *Game, games *mgo.Collection) {

}

func OnPause(g *Game, games *mgo.Collection) {

}

func OnPauseTick(g *Game, games *mgo.Collection) {

}

func OnResume(g *Game, games *mgo.Collection) {

}

func OnStop(g *Game, games *mgo.Collection) {
}

func OnMotionChange(g *Game, games *mgo.Collection, hasMotion int) {

}

func OnDistanceChange(g *Game, games *mgo.Collection, distance float64) {

}

func OnRfid(g *Game, games *mgo.Collection, id int64, text string) {

}

func OnKeypad(g *Game, games *mgo.Collection, key string) {
	log.Infof("Handling key %s", key)

	switch key {
	case "#":
		log.Infof("Submitting Keys: %v", g.Data.Keys)
		handleSubmit(g, games)

	case "*":
		if len(g.Data.Keys) > 0 {
			keys := g.Data.Keys[:len(g.Data.Keys)-1]
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": keys}})
		}

	default:
		keys := append(g.Data.Keys, key)
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": keys}})
	}
}

func OnChangeFloor(g *Game, games *mgo.Collection, floors int) {
	g = Update(games, g.ID, Running, bson.M{"$inc": bson.M{"data.floor": floors}})
}

func handleSubmit(g *Game, games *mgo.Collection) {
	value, length := getKeysAsString(g)
	if length == 0 {
		return
	}

	if g.Data.KeypadMode == Locked {
		if value == UnlockCode {
			g = SetMessage(games, g.ID, "Elevator is unlocked!", 10)
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}, "data.keypadMode": Floors}})
		} else {
			g = SetMessage(games, g.ID, "Elevator is locked", 10)
		}
	} else {
		switch value {
		case FloorsCode:
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}, "data.keypadMode": Floors}})
		case AnswerLettersCode:
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}, "data.keypadMode": AnsweringLetters}})
		case AnswerNumbersCode:
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}, "data.keypadMode": AnsweringNumbers}})
		default:
			handleAnswer(g, games, value)
		}
	}
}

func getKeysAsString(g *Game) (string, int) {
	keyCount := len(g.Data.Keys)

	if keyCount <= 0 {
		return "", 0
	}

	var b bytes.Buffer

	for _, v := range g.Data.Keys {
		b.WriteString(v)
	}

	return b.String(), keyCount
}

func handleAnswer(g *Game, games *mgo.Collection, answer string) {
	switch g.Data.KeypadMode {
	case Floors:
		// Move floor
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}}})

	case AnsweringLetters:
		// Answer letters
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}}})

	case AnsweringNumbers:
		// Answer numbers
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}}})

	default:
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}}})
	}

}
