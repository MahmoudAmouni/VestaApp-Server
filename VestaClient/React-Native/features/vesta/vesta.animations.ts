import { VESTA_CONFIG } from '@/constants/vesta.constants';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import {
    cancelAnimation,
    Easing,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';


export function useVisualizerAnimations() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  const ripple1Scale = useSharedValue(1);
  const ripple1Opacity = useSharedValue(0);
  const ripple2Scale = useSharedValue(1);
  const ripple2Opacity = useSharedValue(0);
  const ripple3Scale = useSharedValue(1);
  const ripple3Opacity = useSharedValue(0);

  const startPulse = () => {
    scale.value = 1;
    opacity.value = 0.9;

    ripple1Scale.value = withRepeat(
      withTiming(1.8, { duration: VESTA_CONFIG.RIPPLE_DURATION, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    ripple1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 200 }),
        withTiming(0, { duration: 1800 })
      ),
      -1,
      false
    );

    ripple2Scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 667 }),
        withTiming(1.8, { duration: VESTA_CONFIG.RIPPLE_DURATION, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );
    ripple2Opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 667 }),
        withTiming(0.5, { duration: 200 }),
        withTiming(0, { duration: 1800 })
      ),
      -1,
      false
    );

    ripple3Scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1334 }),
        withTiming(1.8, { duration: VESTA_CONFIG.RIPPLE_DURATION, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );
    ripple3Opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1334 }),
        withTiming(0.5, { duration: 200 }),
        withTiming(0, { duration: 1800 })
      ),
      -1,
      false
    );
  };

  const stopPulse = () => {
    cancelAnimation(scale);
    cancelAnimation(opacity);
    cancelAnimation(ripple1Scale);
    cancelAnimation(ripple1Opacity);
    cancelAnimation(ripple2Scale);
    cancelAnimation(ripple2Opacity);
    cancelAnimation(ripple3Scale);
    cancelAnimation(ripple3Opacity);

    scale.value = withTiming(1, { duration: 300 });
    opacity.value = withTiming(0.3, { duration: 300 });
    ripple1Opacity.value = withTiming(0, { duration: 300 });
    ripple2Opacity.value = withTiming(0, { duration: 300 });
    ripple3Opacity.value = withTiming(0, { duration: 300 });
  };

  return {
    scale,
    opacity,
    ripple1Scale,
    ripple1Opacity,
    ripple2Scale,
    ripple2Opacity,
    ripple3Scale,
    ripple3Opacity,
    startPulse,
    stopPulse,
  };
}

export function useDotAnimations() {
  const dot1Y = useSharedValue(0);
  const dot2Y = useSharedValue(0);
  const dot3Y = useSharedValue(0);

  const startDots = () => {
    const duration = VESTA_CONFIG.DOT_BOUNCE_DURATION;
    
    dot1Y.value = withRepeat(
      withSequence(
        withTiming(-8, { duration }),
        withTiming(0, { duration })
      ),
      -1,
      false
    );
    
    dot2Y.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 267 }),
        withTiming(-8, { duration }),
        withTiming(0, { duration })
      ),
      -1,
      false
    );
    
    dot3Y.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 534 }),
        withTiming(-8, { duration }),
        withTiming(0, { duration })
      ),
      -1,
      false
    );
  };

  const stopDots = () => {
    cancelAnimation(dot1Y);
    cancelAnimation(dot2Y);
    cancelAnimation(dot3Y);
    dot1Y.value = 0;
    dot2Y.value = 0;
    dot3Y.value = 0;
  };

  return {
    dot1Y,
    dot2Y,
    dot3Y,
    startDots,
    stopDots,
  };
}


export function useSilenceDetection(params: {
  isActive: boolean;
  isRecording: boolean;
  onSilenceDetected: () => void;
}) {
  const { isActive, isRecording, onSilenceDetected } = params;
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastSpeakingTime = useRef<number>(Date.now());
  const hasSpokenYet = useRef<boolean>(false);

  useEffect(() => {
    if (!isActive || !isRecording || Platform.OS !== 'web') return;

    console.log('[Vesta] Setting up Web Audio API silence detection');

    const setupAudioAnalysis = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        hasSpokenYet.current = false;
        lastSpeakingTime.current = Date.now();

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkAudioLevel = () => {
          if (!isActive || !isRecording) return;

          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

          const isSpeakingNow = average > VESTA_CONFIG.VOLUME_THRESHOLD;

          if (isSpeakingNow) {
            hasSpokenYet.current = true;
            lastSpeakingTime.current = Date.now();
          } else if (hasSpokenYet.current) {
            const timeSinceSpeaking = Date.now() - lastSpeakingTime.current;

            if (timeSinceSpeaking > VESTA_CONFIG.SILENCE_DURATION) {
              console.log(`[Vesta] ✅ ${(timeSinceSpeaking / 1000).toFixed(1)}s silence - sending!`);
              onSilenceDetected();
              return;
            }
          }

          animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
        };

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      } catch (err) {
        console.error('[Vesta] Failed to setup audio analysis:', err);
      }
    };

    setupAudioAnalysis();

    return () => {
      console.log('[Vesta] Cleaning up Web Audio API');

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isActive, isRecording, onSilenceDetected]);

  return {
    hasSpokenYet: hasSpokenYet.current,
  };
}
