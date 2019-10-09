const int Seat1PIRSensor 	= 12;
const int Seat1RedLight 	= 10;
const int Seat1YellowLight 	= 9;
const int Seat1GreenLight 	= 8;
const int Seat1CheckBtn 	= 7;
const int Seat1FreeBtn 		= 6;

#define noManThreshold 10
int seat1NoManPeriods = 0;
int seat1HasManPeriods = 0;

void setup() {
  pinMode(Seat1PIRSensor, INPUT);
  pinMode(Seat1RedLight, OUTPUT);
  pinMode(Seat1YellowLight, OUTPUT);
  pinMode(Seat1GreenLight, OUTPUT);
  pinMode(Seat1CheckBtn, INPUT);
  pinMode(Seat1FreeBtn, INPUT);
  Serial.begin(9600);

  digitalWrite(Seat1RedLight, LOW);
  digitalWrite(Seat1YellowLight, LOW);
  digitalWrite(Seat1GreenLight, HIGH);
}

void loop() {
  // 1. Check there is man or not.
  if (seat1NoManPeriods == noManThreshold) {
    Serial.println("R1B");
    seat1NoManPeriods = 0;
  } else if (seat1HasManPeriods == noManThreshold) {
    Serial.println("R1C");
    seat1HasManPeriods = 0;
  }
  if (digitalRead(Seat1PIRSensor) == LOW) {
    seat1NoManPeriods += 1;
  } else {
    seat1HasManPeriods += 1;
  }
  // 2. Process button press.
  if (digitalRead(Seat1CheckBtn) == HIGH) {
    delay(30);
    if (digitalRead(Seat1CheckBtn) == HIGH) {
      Serial.println("R1A");
    }
  }
  if (digitalRead(Seat1FreeBtn) == HIGH) {
    delay(30);
    if (digitalRead(Seat1FreeBtn) == HIGH) {
      Serial.println("R1D");
    }
  }
  // 3. Sync with host.
  char val = char(Serial.read());
  if (val == '1') {
    digitalWrite(Seat1RedLight, LOW);
    digitalWrite(Seat1YellowLight, HIGH);
    digitalWrite(Seat1GreenLight, LOW);
  } else if (val == '2') {
    digitalWrite(Seat1RedLight, LOW);
    digitalWrite(Seat1YellowLight, LOW);
    digitalWrite(Seat1GreenLight, HIGH);
  } else if (val == '3') {
    digitalWrite(Seat1RedLight, HIGH);
    digitalWrite(Seat1YellowLight, LOW);
    digitalWrite(Seat1GreenLight, LOW);
  }
  
  
  delay(100);
}
