import RPi.GPIO as GPIO
import time
import configparser
import requests

EffectsServer = ""
NorthPin = 27  # Input for HC-SR501
EastPin = 22 # Input for HC-SR501
SouthPin = 4  # Input for HC-SR501
WestPin = 17  # Input for HC-SR501

LastMovementState_N = 0
LastMovementState_E = 0
LastMovementState_S = 0
LastMovementState_W = 0


def setup():
    global EffectsServer, NorthPin, EastPin, SouthPin, WestPin

    print("> Set up")
    config = configparser.ConfigParser()
    config.read('config.ini')

    EffectsServer = config['DEFAULT']['EffectsServer']
    NorthPin = int(config['motion']['NorthPin'])
    EastPin = int(config['motion']['EastPin'])
    SouthPin = int(config['motion']['SouthPin'])
    WestPin = int(config['motion']['WestPin'])

    print("> N: " + str(NorthPin) + ", E: " + str(EastPin) + ", S: " + str(SouthPin) + ", W: " + str(WestPin))

    GPIO.setmode(GPIO.BCM)
    GPIO.setup(NorthPin, GPIO.IN)  # Read output from PIR motion sensor
    # GPIO.setup(EastPin, GPIO.IN)  # Read output from PIR motion sensor
    # GPIO.setup(SouthPin, GPIO.IN)  # Read output from PIR motion sensor
    # GPIO.setup(WestPin, GPIO.IN)  # Read output from PIR motion sensor


def n_state_change(channel):
    global LastMovementState_N

    LastMovementState_N = state_change(LastMovementState_N, 'N')


def e_state_change(channel):
    global LastMovementState_E

    LastMovementState_E = state_change(LastMovementState_E, 'E')


def s_state_change(channel):
    global LastMovementState_S

    LastMovementState_S = state_change(LastMovementState_S, 'S')


def w_state_change(channel):
    global LastMovementState_W

    LastMovementState_W = state_change(LastMovementState_W, 'W')


def state_change(last, direction):
    if last == 0:
        last = 1
    else:
        last = 0

    send(last, direction)

    return last


def loop():
    global NorthPin, EastPin, SouthPin, WestPin

    GPIO.add_event_detect(NorthPin, GPIO.BOTH, callback=n_state_change)
    # GPIO.add_event_detect(EastPin, GPIO.BOTH, callback=e_state_change)
    # GPIO.add_event_detect(SouthPin, GPIO.BOTH, callback=s_state_change)
    # GPIO.add_event_detect(WestPin, GPIO.BOTH, callback=w_state_change)

    while True:
        time.sleep(10)


def send(has_motion, direction):
    global EffectsServer

    print('Sending motion: ' + str(has_motion) + ' - ' + direction)

    r = requests.post(EffectsServer + "/motion", json={"hasMotion": has_motion, "direction": direction})
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
        pass
    finally:
        destroy()
