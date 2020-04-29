var dataShow = {
  ec: 0,
  temp: 0,
  humi: 0,
  pump_water: "off",
  water_fertilizer: "off",
  pump_demote: "off",
  led: "off",
  fan: "off",
};

var config = {
  mqtt_server: "soldier.cloudmqtt.com",
  mqtt_websockets_port: 34053,
  mqtt_user: "xvqozkpl",
  mqtt_password: "VvLH4yIviyfq",
};

function setDataShow() {
  setInterval(() => {
    Object.keys(dataShow).forEach((el, i) => {
      $(`#${el}`).text(dataShow[el]);
    });
  }, 1000);
}

function mqttPublish(topic, msg) {
  setTimeout(() => {
    var message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message);
  }, 500);
}

$(document).ready(function () {
  setDataShow();

  // MQTT Begin
  client = new Paho.MQTT.Client(
    config.mqtt_server,
    config.mqtt_websockets_port,
    "web_" + parseInt(Math.random() * 100, 10)
  );

  client.connect({
    useSSL: true,
    userName: config.mqtt_user,
    password: config.mqtt_password,
    onSuccess: function () {
      console.log("onConnect");
      client.subscribe("/ESP/+");
      // $("#status").text("Connected").removeClass().addClass("connected");
      // client.subscribe("/ESP/LED");
      mqttPublish("/WEB/TEST", "WEB OK!");
    },
    onFailure: function (e) {
      console.log(e);
    },
  });

  client.onConnectionLost = function (responseObject) {
    console.log("onConnectionLost");
    if (responseObject.errorCode !== 0) {
      setTimeout(function () {
        client.connect();
      }, 1000);
    }
  };

  client.onMessageArrived = function (message) {
    console.log(`${message.destinationName} --> ${message.payloadString}`);
    var path = message.destinationName.replace("/ESP/", "");
    if (path == "temp") {
      dataShow[path] = message.payloadString;
    }
  };
  // MQTT End
});
