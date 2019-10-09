import requests
import serial
import json
from time import sleep

PORTX = "COM3" # serial port
BPS = 9600 # bound rate
TIMEX = 5
APIPATH = "http://localhost:8888/api/"

jsonObject = None
serialObject = None

'''
    Serial Instruction System:
        Setter:
            1: Set to Booked
            2: Set to Free
            3: Set to Init-Busy
        Receiver:
            RnA: n Check
            RnB: n Leave
            RnC: n Back (In place)
            RnD: n Release
'''

def refreshJson():
    res = requests.get(APIPATH + 'status')
    jsonText = res.content.decode()
    global jsonObject
    jsonObject = json.loads(jsonText)['seats'][0]
    print('[refreshJson]: Refreshed.')

def makeAPIRequest(id, to, xh=''):
    print('[makeAPIRequest]: ' + "id=" + str(id) + ", to=" + to)
    if to == 'free':
        requests.post(APIPATH + 'set_free', {"id": id}) 
    elif to == 'busy':
        requests.post(APIPATH + 'set_busy', {"id": id})
    elif to == 'leave':
        requests.post(APIPATH + 'set_leave', {"id": id})

def receiveFromCOM():
    global serialObject
    while True:
        data = serialObject.readline()
        if data == '':
            continue
        else:
            break
        sleep(0.02)
    return str(data).replace('\\r\\n', '', 1)

def writeToCOM(content):
    global serialObject
    writtenLen = serialObject.write(str(content).encode())
    sleep(0.5)
    return writtenLen

def makeSerialRequest(id, to):
    global serialObject
    builder = ''
    if to == 'booked':
        builder = '1'
    elif to == 'leave':
        builder = '1'
    elif to == 'free':
        builder = '2'
    elif to == 'busy':
        builder = '3'
    print('[makeSerialRequest]: ', builder)
    return writeToCOM(builder)

def synchronizeJsonByArduino():
    instruction = receiveFromCOM()
    print('[synchronizeJsonByArduino]: ', instruction)
    if instruction.find('R1A') != -1:
        if jsonObject['status'] == 'booked':
            makeAPIRequest(1, 'busy')
    elif instruction.find('R1B') != -1:
        makeAPIRequest(1, 'leave')
    elif instruction.find('R1C') != -1:
        if jsonObject['status'] == 'leave':
            makeAPIRequest(1, 'busy')
    elif instruction.find('R1D') != -1:
        makeAPIRequest(1, 'free')

def synchronizeArduinoByJson():
    if jsonObject['status'] == 'booked':
        makeSerialRequest(1, 'booked')
    elif jsonObject['status'] == 'free':
        makeSerialRequest(1, 'free')
    elif jsonObject['status'] == 'busy':
        makeSerialRequest(1, 'busy')
    elif jsonObject['status'] == 'leave':
        makeSerialRequest(1, 'leave')

def synchronize():
    synchronizeJsonByArduino()
    synchronizeArduinoByJson()
    print('[synchronize]: Synchronized.')

if __name__ == '__main__':
    global serialObject
    serialObject = serial.Serial(PORTX, BPS, timeout=TIMEX)
    if serialObject.isOpen():
        print("[System]: COM connection formed.")
    else:
        print("[System]: COM connection failed.")

    while True:
        refreshJson()
        synchronize()

