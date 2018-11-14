package main

import (
	"escape-room/effects-server/api"
	"escape-room/effects-server/cfg"
	"fmt"

	mgo "github.com/globalsign/mgo"
	"github.com/ian-kent/gofigure"
	"github.com/sirupsen/logrus"
)

func main() {
	log := logrus.WithField("component", "main")

	log.Info("Loading config...")

	config, cfgErr := cfg.Load(gofigure.Gofigure)
	if cfgErr != nil {
		log.Fatalf("Failed to load configs: %v", cfgErr)
	}

	session := setupDatabase(log, config)
	defer session.Close()

	// gin.SetMode(gin.ReleaseMode)

	server := api.SetUp(session)
	server.Run(fmt.Sprintf(":%d", config.Port))
}

func setupDatabase(log *logrus.Entry, config cfg.Config) *mgo.Session {
	log.Info("Setting up database.")
	appDbMasterSession, err := mgo.Dial(config.Db)
	if err != nil {
		log.Fatal("Failed to dial appDbMasterSession: " + err.Error())
	}

	appDbMasterSession.SetMode(mgo.Monotonic, true)

	//db.Ensure(appDbMasterSession, log)

	return appDbMasterSession
}
