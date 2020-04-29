#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Redmi";
const char* password = "0981966915";

String mqtt_client = "esp_" + String(random(0xffff), HEX);
const char* mqtt_server = "soldier.cloudmqtt.com";
const char* mqtt_username = "xvqozkpl";
const char* mqtt_password = "VvLH4yIviyfq";
const int mqtt_port = 14053;

WiFiClient espClient;
PubSubClient client(espClient);

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection…");
    if (client.connect(mqtt_client.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("/WEB/+");
      client.publish("/ESP/TEST", "ESP OK!");
    }
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  int i = 0;
  String msg = "";
  while (i < length) msg += (char)payload[i++];
  String path = (String)topic;
  Serial.println(path + " --> " + msg);
}

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  delay(1);
}
