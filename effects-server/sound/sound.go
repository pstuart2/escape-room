package sound

import (
	"fmt"
	"math/rand"
	"os"
	"time"

	"github.com/faiface/beep"
	"github.com/faiface/beep/speaker"
	"github.com/faiface/beep/wav"
)

// TODO: These sounds are not a part of the repository and is just an example setup
const (
	AccessDenied          = "./sounds/access-denied-buzz.wav" //
	BellDing              = "./sounds/bell-ding.wav"
	DigiBuzz              = "./sounds/digi-buzz.wav"
	Elevator              = "./sounds/elevator.wav"
	TeleporterMalfunction = "./sounds/teleporter-malfunction.wav"
	WrongAnswer           = "./sounds/wrong-answer.wav"
	MarchMusic            = "./sounds/march-music.wav"
	CompleteSong          = "./sounds/complete-song.wav"
	Ominous               = "./sounds/ominous.wav"
	Boom                  = "./sounds/boom.wav"
)

var s beep.StreamSeekCloser
var done chan bool

func Play(sound string) {
	fmt.Printf("Starting sound: %s\n", sound)

	if s != nil {
		fmt.Println("S not nil, closing")
		speaker.Lock()
		s.Close()
		//close(done)
		speaker.Unlock()
	}

	var format beep.Format

	f, _ := os.Open(sound)
	s, format, _ = wav.Decode(f)
	defer func() {
		s.Close()
		s = nil
	}()

	speaker.Init(format.SampleRate, format.SampleRate.N(time.Second/10))

	done = make(chan bool)

	speaker.Play(beep.Seq(s, beep.Callback(func() {
		fmt.Printf("Ending sound: %s\n", sound)
		close(done)
	})))

	<-done
}

/*
func Play(sound string) {
	fmt.Printf("Starting sound: %s\n", sound)

	if ctrl != nil {
		speaker.Lock()
		ctrl.Paused = true
		streamer.Close()
		ctrl.Streamer = nil
		speaker.Unlock()
		done <- true
	}

	f, _ := os.Open(sound)
	s, format, err := wav.Decode(f)
	if err != nil {
		fmt.Printf("Error loading sound: %v\n", err)
		return
	}
	streamer = s
	defer streamer.Close()
	speaker.Init(format.SampleRate, format.SampleRate.N(time.Second/10))

	seq := beep.Seq(streamer, beep.Callback(func() {
		fmt.Printf("Ending sound: %s\n", sound)
		done <- true
	}))

	ctrl = &beep.Ctrl{Streamer: seq, Paused: false}
	speaker.Play(ctrl)

	ctrl = nil
	<-done
	fmt.Printf(">>>> Exiting sound: %s\n", sound)

	/*
		done := make(chan struct{})

			speaker.Play(beep.Seq(s, beep.Callback(func() {
				fmt.Printf("Ending sound: %s\n", sound)
				close(done)
			})))

			<-done
*/

var effects = []string{}

func StartRandomEffects() chan bool {
	stop := make(chan bool)

	go func() {
		r := rand.New(rand.NewSource(time.Now().UnixNano()))

		shouldStop := false
		for !shouldStop {

			nextEffect := effects[r.Intn(len(effects))]
			nextEffectTime := r.Intn(120) + 60
			fmt.Printf("Next effect [%s] playing in [%d]\n", nextEffect, nextEffectTime)

			select {
			case shouldStop = <-stop:
				fmt.Println("Stopping effects")
			case <-time.After(time.Second * time.Duration(nextEffectTime)):
				Play(nextEffect)
			}
		}
	}()

	return stop
}
