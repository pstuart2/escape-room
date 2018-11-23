package game

import (
	"strings"
	"time"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/sirupsen/logrus"
)

var log *logrus.Entry

func OnStarting(g *Game) {
	log = logrus.WithFields(logrus.Fields{
		"component": "game",
		"gameId":    g.ID,
	})

	initDistanceManager()
}

// TODO: Need to add games *mgo.Collection to all these as hotfix so I can update
func OnStartingTick(g *Game, games *mgo.Collection) {

}

func OnStart(g *Game, games *mgo.Collection) {

}

func OnRunningTick(g *Game, games *mgo.Collection) {
	if g.Data.ScriptState != InThirdGate || g.Data.AnswerState != Answering {
		return
	}

	distances := GetDistances()
	expected := g.Data.Gate3Answer[g.Data.CurrentDistanceTestIndex]

	if expected.Distances[0] == int(distances[0]) &&
		expected.Distances[1] == int(distances[1]) &&
		expected.Distances[2] == int(distances[2]) {
		handleCorrectDistanceAnswer(g, games, distances)
	} else {
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.currentDistances": distances}, "$inc": bson.M{"data.currentDistanceTestSeconds": -1}})
	}

}

func handleCorrectDistanceAnswer(g *Game, games *mgo.Collection, distances []float64) {
	if len(g.Data.Gate3Answer) == g.Data.CurrentDistanceTestIndex+1 {
		handleCorrectAnswer(g, games, "Correct", WaitingOnEgg)
		return
	}

	g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.currentDistances": distances, "data.stateAnswer": "Correct", "data.answerState": Correct}})

	db := games.Database.Session.Copy()
	go func() {
		defer db.Close()
		games = Games(db)

		time.Sleep(5 * time.Second)
		nextTest := g.Data.Gate3Answer[g.Data.CurrentDistanceTestIndex+1]
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": "", "data.answerState": Answering, "data.currentDistanceTestSeconds": nextTest.Seconds}, "$inc": bson.M{"data.currentDistanceTestIndex": 1}})
	}()

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

func OnDistanceChange(index int, distance float64) {
	SetDistance(DistanceValue{Index: index, Distance: distance})
}

func OnRfid(g *Game, games *mgo.Collection, id int64, text string) {
	switch g.Data.ScriptState {
	case WaitingOnFirstKey:
		if text == g.Data.Key1RfidText {
			// Open first gate
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.scriptState": InFirstGate, "data.stateText": "Finish the first gate"}})
		}
		break

	case InFirstGate:
		handleRfidGates(g, games, text, g.Data.Gate1Answer, WaitingOnSecondKey)
		break

	case WaitingOnSecondKey:
		if text == g.Data.Key2RfidText {
			// Open second gate
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.scriptState": InSecondGate, "data.stateText": "Finish the second gate"}})
		}
		break

	case InSecondGate:
		handleRfidGates(g, games, text, g.Data.Gate2Answer, WaitingOnThirdKey)
		break

	case WaitingOnThirdKey:
		if text == g.Data.Key3RfidText {
			// Open second gate
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.scriptState": InThirdGate, "data.stateText": "Finish the third gate"}})
		}
		break
	}
}

func handleRfidGates(g *Game, games *mgo.Collection, text string, gateAnswer string, nextState ScriptState) {
	if len(text) == 1 {
		answer := g.Data.StateAnswer + text
		if len(answer) < len(gateAnswer) {
			if !strings.HasPrefix(gateAnswer, answer) {
				// Still Correct
				g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": answer}})
			} else {
				// Wrong
				handleWrongAnswer(g, games, answer)
			}
		} else {
			if answer == gateAnswer {
				// Correct
				handleCorrectAnswer(g, games, answer, nextState)
			} else {
				// Wrong
				handleWrongAnswer(g, games, answer)
			}
		}
	}
}

func handleWrongAnswer(g *Game, games *mgo.Collection, answer string) {
	g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": answer, "data.answerState": Wrong}})

	db := games.Database.Session.Copy()
	go func() {
		defer db.Close()
		games = Games(db)

		time.Sleep(5 * time.Second)
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": "", "data.answerState": Answering}})
	}()
}

func handleCorrectAnswer(g *Game, games *mgo.Collection, answer string, nextState ScriptState) {
	g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": answer, "data.answerState": Correct}})

	db := games.Database.Session.Copy()
	go func() {
		defer db.Close()
		games = Games(db)

		time.Sleep(5 * time.Second)
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": "", "data.answerState": Answering, "data.scriptState": nextState}})
	}()
}
