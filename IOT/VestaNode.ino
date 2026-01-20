#include <WiFi.h>
#include <WebServer.h>
#include "secrets.h"

const int lampPin = 2;

WebServer server(80);

String getHTML(String status) {
  String html = "<!DOCTYPE html><html>";
  html += "<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";
  html += "<style>body{font-family: Helvetica; text-align: center;}";
  html += ".button {background-color: #4CAF50; border: none; color: white; padding: 16px 40px;";
  html += "text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}";
  html += ".off {background-color: #555555;}</style></head>";
  html += "<body><h1>Vesta Device Control</h1>";
  html += "<p>Current Status: <strong>" + status + "</strong></p>";
  
  if(status == "OFF") {
    html += "<p><a href=\"/on\"><button class=\"button\">TURN ON</button></a></p>";
  } else {
    html += "<p><a href=\"/off\"><button class=\"button off\">TURN OFF</button></a></p>";
  }
  
  html += "</body></html>";
  return html;
}

void setup() {
  Serial.begin(115200);
  pinMode(lampPin, OUTPUT);
  digitalWrite(lampPin, LOW); 

  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/", []() {
    server.send(200, "text/html", getHTML("OFF"));
  });

  server.on("/on", []() {
    digitalWrite(lampPin, HIGH);
    Serial.println("Lamp turned ON");
    server.send(200, "text/html", getHTML("ON"));
  });

  server.on("/off", []() {
    digitalWrite(lampPin, LOW);
    Serial.println("Lamp turned OFF");
    server.send(200, "text/html", getHTML("OFF"));
  });

  server.begin();
  Serial.println("Web server started!");
}

void loop() {
  server.handleClient();
}