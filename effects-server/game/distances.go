package game

// https://notes.shichao.io/gopl/ch9/

type DistanceValue struct {
	Distance float64
	Index    int
}

var set = make(chan DistanceValue) // send amount to deposit
var get = make(chan []float64)     // receive balance

func SetDistance(distance DistanceValue) { set <- distance }
func GetDistances() []float64            { return <-get }

func distanceManager() {
	distances := make([]float64, 3)
	for {
		select {
		case distance := <-set:
			distances[distance.Index] = distance.Distance
		case get <- distances:
		}
	}
}

func initDistanceManager() {
	go distanceManager() // start the monitor goroutine
}
