# Ultrasonic Module HC-SR04 Distance Sensor
# https://tutorials-raspberrypi.com/raspberry-pi-ultrasonic-sensor-hc-sr04/
import RPi.GPIO as GPIO
import time
import configparser
import requests

EffectsServer = ""
TriggerPin = 18
EchoPin = 24
PollingTime = 0.5


def setup():
    global EffectsServer, TriggerPin, EchoPin, PollingTime

    print("> Set up")
    config = configparser.ConfigParser()
    config.read('config.ini')

    EffectsServer = config['DEFAULT']['EffectsServer']
    TriggerPin = int(config['distance']['TriggerPin'])
    EchoPin = int(config['distance']['EchoPin'])
    PollingTime = float(config['distance']['PollingTime'])

    GPIO.setmode(GPIO.BCM)
    GPIO.setup(TriggerPin, GPIO.OUT)
    GPIO.setup(EchoPin, GPIO.IN)


def loop():
    global PollingTime

    while True:
        dist = distance()
        print("Measured Distance = %.1f cm" % dist)
        send(dist)
        time.sleep(PollingTime)


def distance():
    global TriggerPin, EchoPin

    # set Trigger to HIGH
    GPIO.output(TriggerPin, True)

    # set Trigger after 0.01ms to LOW
    time.sleep(0.00001)
    GPIO.output(TriggerPin, False)

    start_time = time.time()
    stop_time = time.time()

    # save StartTime
    while GPIO.input(EchoPin) == 0:
        start_time = time.time()

    # save time of arrival
    while GPIO.input(EchoPin) == 1:
        stop_time = time.time()

    # time difference between start and arrival
    time_elapsed = stop_time - start_time

    # multiply with the sonic speed (34300 cm/s)
    # and divide by 2, because there and back
    return (time_elapsed * 34300) / 2


def send(has_distance):
    global EffectsServer

    r = requests.post(EffectsServer + "/distance", json={"distance": has_distance})
    if r.status_code != 200:
        print("send_command Status: " + str(r.status_code))


def destroy():
    print("> Clean up")
    GPIO.cleanup()  # Release resource


if __name__ == '__main__':  # Program start from here
    setup()
    try:
        loop()
    except KeyboardInterrupt:
        destroy()
