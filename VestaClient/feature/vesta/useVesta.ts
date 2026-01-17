import { useAuth } from '@/contexts/auth/AuthContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useDotAnimations, useSilenceDetection, useVisualizerAnimations } from './vesta.animations';
import { apiSendVoiceMessage } from './vesta.api';
import { useAudioPermissions, useAudioPlayback, useAudioRecording } from './vesta.audio';
import { VoiceRecordingState } from './vesta.types';

/**
 * Main composite hook for Vesta voice assistant
 * Combines all sub-hooks and provides unified interface
 */
export function useVesta() {
  const { session } = useAuth();
  
  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  
  // Ref to track active state inside async closures
  const isCallActiveRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  // Audio hooks
  const { micPermission, requestPermission } = useAudioPermissions();
  const { recorder, recorderState, startRecording, stopRecording } = useAudioRecording();
  const { player, playerStatus, playTextToSpeech, stopPlayback } = useAudioPlayback();

  // Animation hooks
  const visualizerAnimations = useVisualizerAnimations();
  const dotAnimations = useDotAnimations();

  // Determine current state
  const currentState: VoiceRecordingState = isProcessing
    ? VoiceRecordingState.THINKING
    : playerStatus.playing
    ? VoiceRecordingState.SPEAKING
    : recorderState.isRecording
    ? VoiceRecordingState.LISTENING
    : VoiceRecordingState.IDLE;

  // Safe start recording wrapper
  const safeStartRecording = useCallback(async () => {
    // Don't record if we are thinking, speaking, or if the call is inactive
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

  // Start call
  const handleStartCall = useCallback(async () => {
    const hasPermission = micPermission || (await requestPermission());
    if (!hasPermission) {
      setIsExpanded(false);
      setIsCallActive(false);
      return;
    }

    setIsExpanded(true);
    setIsCallActive(true);
    // Ref updated via effect, but set check safe for immediate use if needed or rely on state next render
    // We can't immediately record here if we rely on the effect syncing the ref, 
    // but startRecording usually takes a moment or we called it directly.
    // Let's manually set ref for safety in this closure if we used safeStartRecording immediately, 
    // but better to just call startRecording directly here as we KNOW we want to start.
    
    try {
      // Direct call to startRecording to bypass "isCallActiveRef" lag if any, 
      // though typically safeStartRecording is better. 
      // For initial start, we know we are valid.
      await startRecording();
    } catch (error) {
      console.error('[Vesta] Failed to start call:', error);
      Alert.alert('Error', 'Could not start recording.');
      setIsExpanded(false);
      setIsCallActive(false);
    }
  }, [micPermission, requestPermission, startRecording]);

  // Stop call
  const handleStopCall = useCallback(async () => {
    console.log('[Vesta] Stopping call - killing all processes');

    // Immediate state update
    setIsCallActive(false);
    setIsExpanded(false);
    setIsProcessing(false);
    isCallActiveRef.current = false; // Immediate ref update to block asyncs

    // Stop recording immediately
    if (recorderState.isRecording) {
      await stopRecording().catch((err) =>
        console.error('[Vesta] Error stopping recorder:', err)
      );
    }

    // Stop playback immediately
    stopPlayback();
  }, [recorderState.isRecording, stopRecording, stopPlayback]);

  // Send voice message
  const handleSendMessage = useCallback(async () => {
    if (!session?.token || !session?.homeId) {
      console.error('[Vesta] Missing session token or homeId');
      Alert.alert('Error', 'You must be logged in to use Vesta.');
      return;
    }

    // abort if call stopped
    if (!isCallActiveRef.current) return;

    console.log('[Vesta] Sending voice message');
    setIsProcessing(true);

    try {
      // Stop recording and get URI
      const uri = await stopRecording();

      // Check if call is still active after stopping recording
      if (!isCallActiveRef.current) {
        setIsProcessing(false);
        return;
      }

      if (!uri) {
        console.warn('[Vesta] No recording URI found');
        if (isCallActiveRef.current) setIsProcessing(false);
        // We do NOT restart recording here, we just go back to IDLE/Listening via manual trigger or wait?
        // Actually if we failed to get audio, we probably should go back to listening IF active.
        if (isCallActiveRef.current) safeStartRecording();
        return;
      }

      console.log('[Vesta] Uploading audio...');
      const responseText = await apiSendVoiceMessage({
        audioUri: uri,
        homeId: session.homeId,
        token: session.token,
      });

      // Check active again after network request
      if (!isCallActiveRef.current) {
        console.log('[Vesta] Call stopped during api request, ignoring response');
        setIsProcessing(false);
        return;
      }

      console.log('[Vesta] Response received, generating speech...');
      await playTextToSpeech(responseText);
      
      // We remain isProcessing = true until playback starts? 
      // playTextToSpeech is async but returns when "ready" to play (sets uri).
      // Once it sets uri, player starts.
      
    } catch (error) {
      console.error('[Vesta] Error sending message:', error);
      // Restart listening on error if still active
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

  // Silence detection
  useSilenceDetection({
    isActive: isCallActive,
    isRecording: recorderState.isRecording,
    onSilenceDetected: handleSendMessage,
  });

  // Control animations based on state
  useEffect(() => {
    if (isProcessing) {
      visualizerAnimations.stopPulse();
      dotAnimations.startDots();
    } else {
      dotAnimations.stopDots();
     
      // Pulse if playing OR recording (but not if just idle)
      if (playerStatus.playing || recorderState.isRecording) {
        visualizerAnimations.startPulse();
      } else {
        visualizerAnimations.stopPulse();
      }
    }
  }, [isProcessing, playerStatus.playing, recorderState.isRecording]);

  // Auto-restart recording after playback finishes
  useEffect(() => {
    // Only restart if:
    // 1. Call is active
    // 2. Playback just finished
    // 3. We are NOT currently processing (thinking)
    // 4. We are NOT currently recording
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
    recorderState.isRecording, // Added dep
    safeStartRecording
  ]);

  return {
    // State
    isExpanded,
    isProcessing,
    isCallActive,
    currentState,
    
    // Actions
    startCall: handleStartCall,
    stopCall: handleStopCall,
    sendMessage: handleSendMessage,
    
    // Audio state
    recorderState,
    playerStatus,
    
    // Animations
    visualizerAnimations,
    dotAnimations,
    
    // Session
    hasSession: Boolean(session?.token),
  };
}
