import { VESTA_CONFIG } from '@/constants/vesta.constants';
import {
    AudioModule,
    RecordingPresets,
    useAudioPlayer,
    useAudioPlayerStatus,
    useAudioRecorder,
    useAudioRecorderState,
} from 'expo-audio';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { apiTextToSpeech, blobToFileUri } from './vesta.api';


export function useAudioRecording() {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(recorder, VESTA_CONFIG.RECORDER_POLL_INTERVAL);

  const startRecording = useCallback(async () => {
    try {
      if (recorderState.isRecording) {
         return;
      }
      await recorder.prepareToRecordAsync();
      recorder.record();
      console.log('[Vesta] Recording started');
    } catch (error) {
      console.error('[Vesta] Failed to start recording:', error);
      throw error;
    }
  }, [recorder, recorderState.isRecording]);

  const stopRecording = useCallback(async () => {
    try {
      if (recorderState.isRecording) {
        await recorder.stop();
        console.log('[Vesta] Recording stopped');
      }
      return recorder.uri;
    } catch (error) {
      console.error('[Vesta] Failed to stop recording:', error);
      throw error;
    }
  }, [recorder, recorderState.isRecording]);

  return {
    recorder,
    recorderState,
    startRecording,
    stopRecording,
  };
}


export function useAudioPlayback() {
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const player = useAudioPlayer(audioUri);
  const playerStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    if (audioUri && player && !player.playing) {
      console.log('[Vesta] Auto-playing audio...');
      player.play();
    }
  }, [audioUri, player]);

  const playTextToSpeech = useCallback(
    async (text: string) => {
      try {
        const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
        if (!apiKey) {
          console.warn('[Vesta] No OpenAI API Key found');
          return;
        }

        console.log('[Vesta] Generating TTS for:', text.substring(0, 50) + '...');
        const blob = await apiTextToSpeech({ text, apiKey });

        let uri: string;
        if (Platform.OS === 'web') {
          uri = URL.createObjectURL(blob);
        } else {
          uri = await blobToFileUri(blob);
        }

        setAudioUri(uri);
        console.log('[Vesta] TTS ready, playing...');
      } catch (error) {
        console.error('[Vesta] Error generating speech:', error);
      }
    },
    []
  );

  const stopPlayback = useCallback(() => {
    if (player?.playing) {
      player.pause();
    }
    setAudioUri(null);
  }, [player]);

  return {
    player,
    playerStatus,
    audioUri,
    playTextToSpeech,
    stopPlayback,
  };
}


export function useAudioPermissions() {
  const [micPermission, setMicPermission] = useState(false);

  const requestPermission = useCallback(async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setMicPermission(status.granted);
      
      if (!status.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow microphone access to use Vesta.'
        );
      }
      
      return status.granted;
    } catch (error) {
      console.error('[Vesta] Permission error:', error);
      return false;
    }
  }, []);

  return {
    micPermission,
    requestPermission,
  };
}
