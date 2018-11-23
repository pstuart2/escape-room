package game

// Data Stores the custom data for this game
type Data struct {
	ScriptState                ScriptState    `bson:"scriptState" json:"scriptState"`
	StateText                  string         `bson:"stateText" json:"stateText"`
	StateAnswer                string         `bson:"stateAnswer" json:"stateAnswer"`
	AnswerState                AnswerState    `bson:"answerState" json:"answerState"`
	ClueText                   string         `bson:"clueText" json:"clueText"`
	Key1RfidText               string         `bson:"key1RfidText" json:"key1RfidText"`
	Key2RfidText               string         `bson:"key2RfidText" json:"key2RfidText"`
	Key3RfidText               string         `bson:"key3RfidText" json:"key3RfidText"`
	Gate1Answer                string         `bson:"gate1Answer" json:"gate1Answer"`
	Gate2Answer                string         `bson:"gate2Answer" json:"gate12Answer"`
	Gate3Answer                []DistanceTest `bson:"gate3Answer" json:"gate3Answer"`
	CurrentDistances           []int          `bson:"currentDistances" json:"currentDistances"`
	CurrentDistanceTestIndex   int            `bson:"currentDistanceTestIndex" json:"currentDistanceTestIndex"`
	CurrentDistanceTestSeconds int            `bson:"currentDistanceTestSeconds" json:"currentDistanceTestSeconds"`
}

type DistanceTest struct {
	Distances []int `bson:"distances" json:"distances"`
	Seconds   int   `bson:"seconds" json:"seconds"`
}

type ScriptState uint

const (
	WaitingOnFirstKey ScriptState = iota
	InFirstGate
	WaitingOnSecondKey
	InSecondGate
	WaitingOnThirdKey
	InThirdGate
	WaitingOnEgg
	Complete
)

type AnswerState uint

const (
	Answering AnswerState = iota
	Wrong
	Correct
)
