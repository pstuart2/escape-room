# https://pimylifeup.com/raspberry-pi-rfid-rc522/

import RPi.GPIO as GPIO
import SimpleMFRC522

reader = SimpleMFRC522.SimpleMFRC522()

try:
    id, text = reader.read()
    print(id)
    print(text)
finally:
    GPIO.cleanup()
