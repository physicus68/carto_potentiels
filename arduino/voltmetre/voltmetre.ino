int sensorValue = 0;
float voltage = 0.0;

// oversampling
int n = 2;
int N = int(pow(2, 2 * n));
unsigned int D = int(pow(2, 10 + n));
unsigned long buffer = 0;
int i = 0;

void setup() {
   Serial.begin(9600);
}

void loop() {
  i = 0;
  buffer = 0;
  while(i<N){    
    sensorValue = analogRead(A0);      
    buffer = buffer + sensorValue;
    i++;
  }
  buffer = buffer >> n;
  voltage = buffer / float(D) * 5.0;
  while(Serial.available()){
    char c = Serial.read();
    if (c=='m'){
      Serial.println(voltage,3);    
    }
  }
  
}
