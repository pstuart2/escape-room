package game

type KeypadMode uint

const (
	Locked KeypadMode = iota
	Floors
	AnsweringLetters
	AnsweringNumbers
)

const UnlockCode string = "7956"
const FloorsCode string = "0001"
const AnswerLettersCode string = "0335"
const AnswerNumbersCode string = "0772"

// Data Stores the custom data for this game
type Data struct {
	Floor              float64    `bson:"floor" json:"floor"`
	Keys               []string   `bson:"keys" json:"keys"`
	KeypadMode         KeypadMode `bson:"keypadMode" json:"keypadMode"`
	Answer             []string   `bson:"answer" json:"answer"`
	Message            string     `bson:"message" json:"message"`
	MessageSecondsLeft int        `bson:"messageSecondsLeft" json:"messageSecondsLeft"`
}
