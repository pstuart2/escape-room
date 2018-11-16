package api

import "github.com/globalsign/mgo"

func Games(s *mgo.Session) *mgo.Collection {
	return s.DB("").C("games")
}
