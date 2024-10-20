import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import BluetoothSerial from "react-native-bluetooth-serial-next";

const BluetoothExample = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [dataReceived, setDataReceived] = useState("");

  useEffect(() => {
    // Enable Bluetooth when component mounts
    BluetoothSerial.isEnabled()
      .then((enabled) => {
        if (!enabled) {
          return BluetoothSerial.enable();
        }
      })
      .catch((err) => console.log(err));

    // Set up data receiving
    BluetoothSerial.withDelimiter("\n").then(() => {
      BluetoothSerial.on("read", (data) => {
        console.log("Received:", data);
        setDataReceived(data);
      });
    });

    return () => {
      // Clean up event listeners when the component unmounts
      BluetoothSerial.removeListener("read");
    };
  }, []);

  const connectToHC05 = () => {
    // Replace with your HC-05 address
    const deviceId = "00:21:13:00:89:3D";
    BluetoothSerial.connect(deviceId)
      .then(() => {
        console.log("Connected to HC-05");
        setIsConnected(true);
      })
      .catch((err) => console.log("Error:", err));
  };

  const sendMessage = () => {
    BluetoothSerial.write("Hello HC-05!")
      .then(() => console.log("Message sent"))
      .catch((err) => console.log("Error sending message:", err));
  };

  return (
    <View>
      <Text>{isConnected ? "Connected to HC-05" : "Not Connected"}</Text>
      <Text>Received Data: {dataReceived}</Text>
      <Button title="Connect to HC-05" onPress={connectToHC05} />
      {isConnected && <Button title="Send Message" onPress={sendMessage} />}
    </View>
  );
};

export default BluetoothExample;
