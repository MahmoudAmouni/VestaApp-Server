import { useAuth } from "@/contexts/auth/AuthContext";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import * as Speech from "expo-speech";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";

function RecordingPlayback({ uri }: { uri: string }) {
  const player = useAudioPlayer(uri);

  return (
    <View style={{ gap: 8 }}>
      <Button
        title="Play my recorded message"
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
      />
      <Button title="Stop playback" onPress={() => player.pause()} />
    </View>
  );
}

export default function VestaTestScreen() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const recorderState = useAudioRecorderState(recorder);
  const { token, homeId } = useAuth();

  const [micReady, setMicReady] = useState(false);
  const [lastRecordingUri, setLastRecordingUri] = useState<string | null>(null);
  const [lastHeardPlaceholder, setLastHeardPlaceholder] = useState<string>("");


  const fridgeItems = useMemo(() => ["eggs", "milk", "cheese", "tomatoes"], []);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync(); 
      if (!status.granted) {
        Alert.alert(
          "Microphone permission denied",
          "Enable it in Settings to test recording."
        );
        setMicReady(false);
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      setMicReady(true);
    })();
  }, []);





  const sayHello = () => {
    Speech.stop();
    Speech.speak("Hello. How can I help you?", {
      rate: 0.95,
    });
  };

  const startRecording = async () => {
    if (!micReady) return;

    Speech.stop();

    setLastRecordingUri(null);
    setLastHeardPlaceholder("");

    try {
        await recorder.prepareToRecordAsync(); 
        recorder.record(); 
    } catch (e) {
        console.error("Failed to start recording:", e);
    }
  };

  const uploadAudio = async (uri: string) => {
    if (!token || !homeId) {
        Alert.alert("Error", "Not logged in (missing token or homeId)");
        return;
    }

    const formData = new FormData();
    formData.append("home_id", String(homeId));
    formData.append("laravel_token", token);
    
    if (Platform.OS === "web") {
      const resp = await fetch(uri);
      const blob = await resp.blob();
      formData.append("audio", blob, "voice_command.m4a");
    } else {
      formData.append("audio", {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: 'recording.m4a',
        type: 'audio/m4a',
      } as any);
    }

    try {
        const payload = JSON.stringify({
          home_id: String(homeId),
          laravel_token: token, 
          audio: {
            uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            name: 'recording.m4a',
            type: 'audio/m4a', 
          }
        }, null, 2);
        
        console.log("FormData Payload:", payload);
        Alert.alert("Debug Payload", payload);
        const response = await fetch("http://127.0.0.1:8001/api/agent/chat", {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json",
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Upload failed:", response.status, text);
            Alert.alert("Upload Failed", `Status: ${response.status}\n${text}`);
            return;
        }

        const data = await response.json();
        console.log("Upload success:", data);
        Alert.alert("Vesta Response", JSON.stringify(data, null, 2));

    } catch (e) {
        console.error("Upload error:", e);
        Alert.alert("Error", "Failed to upload audio. Check console.");
    }
  };

  const stopAndRespond = async () => {
    try {
        await recorder.stop();
    } catch (e) {
        console.error("Failed to stop recording:", e);
    }
    const uri = recorder.uri;

    if (uri) {
        setLastRecordingUri(uri);
        await uploadAudio(uri);
    }

    setLastHeardPlaceholder(
      "📝 Uploading audio..."
    );

    const answer = `You have in your fridge: ${fridgeItems.join(", ")}.`;

    Speech.stop();
    Speech.speak(answer, { 
        rate: 0.95,
        onDone: () => {
        }
    });
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Vesta Voice Test</Text>

      <Button title="Vesta: Hello" onPress={sayHello} />

      <Button
        title={recorderState.isRecording ? "Stop & Respond" : "Start Recording"}
        disabled={!micReady}
        onPress={recorderState.isRecording ? stopAndRespond : startRecording}
      />

      <Text>Mic ready: {micReady ? "Yes" : "No"}</Text>
      <Text>Recording: {recorderState.isRecording ? "Yes" : "No"}</Text>


      {lastHeardPlaceholder ? <Text>{lastHeardPlaceholder}</Text> : null}

      {lastRecordingUri ? (
        <View style={{ gap: 8 }}>
          <Text>Last recording saved at:</Text>
          <Text selectable>{lastRecordingUri}</Text>
          <RecordingPlayback uri={lastRecordingUri} />
        </View>
      ) : null}
    </View>
  );
}
