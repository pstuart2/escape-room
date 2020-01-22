package game

// Data Stores the custom data for this game
type Data struct {
	Floor float64  `bson:"floor" json:"floor"`
	Keys  []string `bson:"keys" json:"keys"`
}
