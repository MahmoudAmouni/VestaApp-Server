import { useAuth } from '@/contexts/auth/AuthContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useDotAnimations, useSilenceDetection, useVisualizerAnimations } from './vesta.animations';
import { apiSendVoiceMessage } from './vesta.api';
import { useAudioPermissions, useAudioPlayback, useAudioRecording } from './vesta.audio';
import { VoiceRecordingState } from './vesta.types';


export function useVesta() {
  const { session } = useAuth();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  
  const isCallActiveRef = useRef(false);

  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  const { micPermission, requestPermission } = useAudioPermissions();
  const { recorder, recorderState, startRecording, stopRecording } = useAudioRecording();
  const { player, playerStatus, playTextToSpeech, stopPlayback } = useAudioPlayback();

  const visualizerAnimations = useVisualizerAnimations();
  const dotAnimations = useDotAnimations();

  const currentState: VoiceRecordingState = isProcessing
    ? VoiceRecordingState.THINKING
    : playerStatus.playing
    ? VoiceRecordingState.SPEAKING
    : recorderState.isRecording
    ? VoiceRecordingState.LISTENING
    : VoiceRecordingState.IDLE;

  const safeStartRecording = useCallback(async () => {
    if (
      !isCallActiveRef.current ||
      isProcessing ||
      playerStatus.playing ||
      recorderState.isRecording
    ) {
      console.log('[Vesta] Skipping recording start due to invalid state:', {
        isActive: isCallActiveRef.current,
        isProcessing,
        isPlaying: playerStatus.playing,
        isRecording: recorderState.isRecording
      });
      return;
    }
    
    try {
      await startRecording();
    } catch (err) {
      console.error('[Vesta] Failed to start recording:', err);
    }
  }, [isProcessing, playerStatus.playing, recorderState.isRecording, startRecording]);

  const handleStartCall = useCallback(async () => {
    const hasPermission = micPermission || (await requestPermission());
    if (!hasPermission) {
      setIsExpanded(false);
      setIsCallActive(false);
      return;
    }

    setIsExpanded(true);
    setIsCallActive(true);
    
    try {
      await startRecording();
    } catch (error) {
      console.error('[Vesta] Failed to start call:', error);
      Alert.alert('Error', 'Could not start recording.');
      setIsExpanded(false);
      setIsCallActive(false);
    }
  }, [micPermission, requestPermission, startRecording]);

  const handleStopCall = useCallback(async () => {
    console.log('[Vesta] Stopping call - killing all processes');

    setIsCallActive(false);
    setIsExpanded(false);
    setIsProcessing(false);
    isCallActiveRef.current = false; 

    if (recorderState.isRecording) {
      await stopRecording().catch((err) =>
        console.error('[Vesta] Error stopping recorder:', err)
      );
    }

    stopPlayback();
  }, [recorderState.isRecording, stopRecording, stopPlayback]);

  const handleSendMessage = useCallback(async () => {
    if (!session?.token || !session?.homeId) {
      console.error('[Vesta] Missing session token or homeId');
      Alert.alert('Error', 'You must be logged in to use Vesta.');
      return;
    }
    if (!isCallActiveRef.current) return;

    console.log('[Vesta] Sending voice message');
    setIsProcessing(true);

    try {
      const uri = await stopRecording();

      if (!isCallActiveRef.current) {
        setIsProcessing(false);
        return;
      }

      if (!uri) {
        console.warn('[Vesta] No recording URI found');
        if (isCallActiveRef.current) setIsProcessing(false);
        if (isCallActiveRef.current) safeStartRecording();
        return;
      }

      console.log('[Vesta] Uploading audio...');
      const responseText = await apiSendVoiceMessage({
        audioUri: uri,
        homeId: session.homeId,
        token: session.token,
      });

      if (!isCallActiveRef.current) {
        console.log('[Vesta] Call stopped during api request, ignoring response');
        setIsProcessing(false);
        return;
      }

      console.log('[Vesta] Response received, generating speech...');
      await playTextToSpeech(responseText);
      
      
    } catch (error) {
      console.error('[Vesta] Error sending message:', error);
      if (isCallActiveRef.current) {
         setIsProcessing(false);
         await safeStartRecording();
      }
    } finally {
      if (isCallActiveRef.current) {
        setIsProcessing(false);
      }
    }
  }, [
    session,
    stopRecording,
    safeStartRecording,
    playTextToSpeech,
  ]);

  useSilenceDetection({
    isActive: isCallActive,
    isRecording: recorderState.isRecording,
    onSilenceDetected: handleSendMessage,
  });

  useEffect(() => {
    if (isProcessing) {
      visualizerAnimations.stopPulse();
      dotAnimations.startDots();
    } else {
      dotAnimations.stopDots();
     
      if (playerStatus.playing || recorderState.isRecording) {
        visualizerAnimations.startPulse();
      } else {
        visualizerAnimations.stopPulse();
      }
    }
  }, [isProcessing, playerStatus.playing, recorderState.isRecording]);

  useEffect(() => {
    if (
      isCallActive && 
      playerStatus.didJustFinish && 
      !playerStatus.playing && 
      !isProcessing &&
      !recorderState.isRecording
    ) {
      console.log('[Vesta] Playback finished, listening again...');
      safeStartRecording();
    }
  }, [
    isCallActive, 
    playerStatus.playing, 
    playerStatus.didJustFinish, 
    isProcessing, 
    recorderState.isRecording,
    safeStartRecording
  ]);

  return {
    isExpanded,
    isProcessing,
    isCallActive,
    currentState,
    
    startCall: handleStartCall,
    stopCall: handleStopCall,
    sendMessage: handleSendMessage,
    
    recorderState,
    playerStatus,
    
    visualizerAnimations,
    dotAnimations,
    
    hasSession: Boolean(session?.token),
  };
}
