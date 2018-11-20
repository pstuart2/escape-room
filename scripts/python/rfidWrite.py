# https://pimylifeup.com/raspberry-pi-rfid-rc522/
import time

import RPi.GPIO as GPIO
import SimpleMFRC522

reader = SimpleMFRC522.SimpleMFRC522()


def loop():
    while True:
        text = raw_input('New data:')
        print("Now place your tag to write")
        reader.write(text)
        print("Written")
        time.sleep(5)


if __name__ == '__main__':  # Program start from here
    try:
        loop()
    except KeyboardInterrupt:
        pass
    finally:
        GPIO.cleanup()
