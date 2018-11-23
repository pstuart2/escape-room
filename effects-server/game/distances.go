package game

import "math"

// https://notes.shichao.io/gopl/ch9/

type DistanceValue struct {
	Distance float64
	Index    int
}

var set = make(chan DistanceValue) // send amount to deposit
var get = make(chan []int)         // receive balance

func SetDistance(distance DistanceValue) { set <- distance }
func GetDistances() []int                { return <-get }

func distanceManager() {
	distances := make([]int, 3)
	for {
		select {
		case distance := <-set:
			distances[distance.Index] = int(math.Round(distance.Distance))
		case get <- distances:
		}
	}
}

func initDistanceManager() {
	go distanceManager() // start the monitor goroutine
}
