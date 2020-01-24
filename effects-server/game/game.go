package game

import (
	"bytes"
	"escape-room/effects-server/sound"
	"fmt"
	"net/http"
	"strconv"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/sirupsen/logrus"
)

var log *logrus.Entry
var alreadyPlayingElevatorSound = false

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

	floorsLeft := abs(g.Data.TargetFloor - g.Data.Floor)
	log.Infof("Target: %d, Current: %d, Left: %d", g.Data.TargetFloor, g.Data.Floor, floorsLeft)

	// TODO: Making it 2 to help prevent playing floor sound while trying to play correct / wrong sound
	if !alreadyPlayingElevatorSound && floorsLeft >= 2 {
		alreadyPlayingElevatorSound = true
		go func() {
			sound.Play(sound.Elevator)
			alreadyPlayingElevatorSound = false
		}()
	}

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
			sound.Play(sound.MarchMusic)
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}, "data.keypadMode": Floors}})
		} else {
			g = SetMessage(games, g.ID, "Elevator is locked", 10)
			sound.Play(sound.WrongAnswer)
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
		targetFloor, _ := strconv.Atoi(answer)
		moveFloors(g, games, targetFloor)
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.keys": []string{}, "data.targetFloor": targetFloor}})

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

func moveFloors(g *Game, games *mgo.Collection, targetFloor int) {
	floorDiff := targetFloor - g.Data.Floor
	if floorDiff == 0 {
		return
	}

	db := games.Database.Session.Copy()
	go func() {
		defer db.Close()
		absFloorDiff := abs(floorDiff)

		if floorDiff > 0 {
			_, err := http.Get(fmt.Sprintf("http://192.168.86.102:8080/up/%d", absFloorDiff))
			if err != nil {
				log.Errorf("Error moving floors: %v", err)
			}
		} else {
			_, err := http.Get(fmt.Sprintf("http://192.168.86.102:8080/down/%d", absFloorDiff))
			if err != nil {
				log.Errorf("Error moving floors: %v", err)
			}
		}

		checkIfKeyFloor(g, Games(db), targetFloor)
	}()
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func checkIfKeyFloor(g *Game, games *mgo.Collection, floor int) {
	nextSequenceIndex := len(g.Data.ActualFloorSequence)
	if floor == g.Data.ExpectedFloorSequence[nextSequenceIndex] {
		// Correct Floor!

		actualFloors := append(g.Data.ActualFloorSequence, floor)
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.actualFloorSequence": actualFloors}})
		sound.Play(sound.BellDing)

		checkIfKeyComplete(g, games)
	} else {
		// Wrong Floor!

		g = SetMessage(games, g.ID, "Wrong floor", 5)
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.actualFloorSequence": []int{}}})
		sound.Play(sound.WrongAnswer)
	}
}

func checkIfKeyComplete(g *Game, games *mgo.Collection) {
	if len(g.Data.ExpectedFloorSequence) != len(g.Data.ActualFloorSequence) {
		// Not done
		return
	}

	g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"state": Finished}})
	go func() {
		_, err := http.Get("http://192.168.86.102:8080/rainbow")
		if err != nil {
			log.Errorf("Rainbow error: %v", err)
		}
	}()

	go func() {
		sound.Play(sound.CompleteSong)
	}()
}
