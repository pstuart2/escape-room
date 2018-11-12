import RPi.GPIO as GPIO
import time

MotionPin = 4  # Input for HC-S501

ResetTime = 5
PollingTime = 0.25


def setup():
    print "> Set up"
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(MotionPin, GPIO.IN)  # Read output from PIR motion sensor


def loop():
    global i_last

    i_last = 1

    while True:
        i_current = GPIO.input(MotionPin)
        send_on_change(i_current, i_last)

        if i_current == 0:  # When output from motion sensor is LOW
            print "No intruders", i_current

        elif i_current == 1:  # When output from motion sensor is HIGH
            print "Intruder detected", i_current

        i_last = i_current


def send_on_change(current, last):
    global PollingTime, ResetTime

    if current != last:
        print "Sending change"

        if current == 0:
            print "Resetting"
            time.sleep(ResetTime)
    else:
        time.sleep(PollingTime)


def destroy():
    print "> Clean up"
    GPIO.cleanup()  # Release resource


if __name__ == '__main__':  # Program start from here
    setup()
    try:
        loop()
    except KeyboardInterrupt:
        destroy()
