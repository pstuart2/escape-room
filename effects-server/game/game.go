package game

import (
	"escape-room/effects-server/sound"
	"strings"
	"time"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/sirupsen/logrus"
)

var log *logrus.Entry

func Init(g *Game) {
	log = logrus.WithFields(logrus.Fields{
		"component": "game",
		"gameId":    g.ID,
	})
}

func OnStarting(g *Game) {
	sound.Play(sound.ChainDoorShut)
	Init(g)
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

	if expected.Distances[0] == distances[0] &&
		expected.Distances[1] == distances[1] &&
		expected.Distances[2] == distances[2] {
		handleCorrectDistanceAnswer(g, games, distances)
	} else {
		handleWrongDistanceAnswer(g, games, distances)
	}

}

func handleCorrectDistanceAnswer(g *Game, games *mgo.Collection, distances []int) {
	if len(g.Data.Gate3Answer) == g.Data.CurrentDistanceTestIndex+1 {
		handleCorrectAnswer(g, games, "Correct", WaitingOnEgg, "Use the egg")
		return
	}

	g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.currentDistances": distances, "data.stateAnswer": "Correct", "data.answerState": Correct}})

	sound.Play(sound.CorrectAnswer)

	db := games.Database.Session.Copy()
	go func() {
		defer db.Close()
		games = Games(db)

		time.Sleep(5 * time.Second)
		nextTest := g.Data.Gate3Answer[g.Data.CurrentDistanceTestIndex+1]
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": "", "data.answerState": Answering, "data.currentDistanceTestSeconds": nextTest.Seconds}, "$inc": bson.M{"data.currentDistanceTestIndex": 1}})
	}()
}

func handleWrongDistanceAnswer(g *Game, games *mgo.Collection, distances []int) {
	if g.Data.CurrentDistanceTestSeconds > 0 {
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.currentDistances": distances}, "$inc": bson.M{"data.currentDistanceTestSeconds": -1}})
		return
	}

	g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.currentDistances": distances, "data.stateAnswer": "Wrong", "data.answerState": Wrong}})

	sound.Play(sound.WrongAnswer)

	db := games.Database.Session.Copy()
	go func() {
		defer db.Close()
		games = Games(db)

		time.Sleep(5 * time.Second)
		nextTest := g.Data.Gate3Answer[g.Data.CurrentDistanceTestIndex]
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": "", "data.answerState": Answering, "data.currentDistanceTestSeconds": nextTest.Seconds}})
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
	log.Infof("OnRfid: %d / %s", g.Data.ScriptState, text)

	switch g.Data.ScriptState {
	case WaitingOnFirstKey:
		if text == g.Data.Key1RfidText {
			sound.Play(sound.MusicLoop)
			log.Info("Opening the first gate")
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.scriptState": InFirstGate, "data.stateText": "Finish the first gate"}})
		}
		break

	case InFirstGate:
		handleRfidGates(g, games, text, g.Data.Gate1Answer, WaitingOnSecondKey, "Find second key")
		break

	case WaitingOnSecondKey:
		if text == g.Data.Key2RfidText {
			// Open second gate
			sound.Play(sound.MusicLoop)
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.scriptState": InSecondGate, "data.stateText": "Finish the second gate"}})
		}
		break

	case InSecondGate:
		handleRfidGates(g, games, text, g.Data.Gate2Answer, WaitingOnThirdKey, "Find third key")
		break

	case WaitingOnThirdKey:
		if text == g.Data.Key3RfidText {
			sound.Play(sound.UndergroundEffect)
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.scriptState": InThirdGate, "data.stateText": "Finish the third gate", "data.currentDistanceTestSeconds": 20}})
		}
		break

	case WaitingOnEgg:
		if text == "egg" {
			g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"state": Finished, "data.scriptState": Complete, "data.stateText": "Done!"}})
			sound.Play(sound.Clapping)
		}
	}
}

func handleRfidGates(g *Game, games *mgo.Collection, text string, gateAnswer string, nextState ScriptState, nextText string) {
	if len(text) == 1 {
		answer := g.Data.StateAnswer + text
		log.Infof("answer: %s", answer)
		if len(answer) < len(gateAnswer) {
			if strings.HasPrefix(gateAnswer, answer) {
				log.Info("Has prefix")
				g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": answer}})
			} else {
				log.Info("NOT Has prefix")
				handleWrongAnswer(g, games, answer)
			}
		} else {
			if answer == gateAnswer {
				log.Info("Correct Answer")
				handleCorrectAnswer(g, games, answer, nextState, nextText)
			} else {
				log.Info("NOT Correct Answer")
				handleWrongAnswer(g, games, answer)
			}
		}
	}
}

func handleWrongAnswer(g *Game, games *mgo.Collection, answer string) {
	g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": answer, "data.answerState": Wrong}})

	sound.Play(sound.WrongAnswer)

	db := games.Database.Session.Copy()
	go func() {
		defer db.Close()
		games = Games(db)

		time.Sleep(5 * time.Second)
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": "", "data.answerState": Answering}})
	}()
}

func handleCorrectAnswer(g *Game, games *mgo.Collection, answer string, nextState ScriptState, nextText string) {
	g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": answer, "data.answerState": Correct}})

	sound.Play(sound.CorrectAnswer)

	db := games.Database.Session.Copy()
	go func() {
		defer db.Close()
		games = Games(db)

		time.Sleep(5 * time.Second)
		log.Infof("Updating game next text: %s", nextText)
		g = Update(games, g.ID, Running, bson.M{"$set": bson.M{"data.stateAnswer": "", "data.answerState": Answering, "data.scriptState": nextState, "data.stateText": nextText}})
	}()
}
