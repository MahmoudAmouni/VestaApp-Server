import { VESTA_IMAGES } from '@/constants/vesta.constants';
import { VoiceRecordingState } from '@/features/vesta/vesta.types';
import React from 'react';
import { Image, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { vestaVisualizerStyles as styles } from './VestaVisualizer.styles';

interface VestaVisualizerProps {
  currentState: VoiceRecordingState;
  scale: SharedValue<number>;
  opacity: SharedValue<number>;
  ripple1Scale: SharedValue<number>;
  ripple1Opacity: SharedValue<number>;
  ripple2Scale: SharedValue<number>;
  ripple2Opacity: SharedValue<number>;
  ripple3Scale: SharedValue<number>;
  ripple3Opacity: SharedValue<number>;
  dot1Y: SharedValue<number>;
  dot2Y: SharedValue<number>;
  dot3Y: SharedValue<number>;
}

export default function VestaVisualizer(props: VestaVisualizerProps) {
  const {
    currentState,
    scale,
    opacity,
    ripple1Scale,
    ripple1Opacity,
    ripple2Scale,
    ripple2Opacity,
    ripple3Scale,
    ripple3Opacity,
    dot1Y,
    dot2Y,
    dot3Y,
  } = props;

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const ripple1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ripple1Scale.value }],
    opacity: ripple1Opacity.value,
  }));

  const ripple2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ripple2Scale.value }],
    opacity: ripple2Opacity.value,
  }));

  const ripple3Style = useAnimatedStyle(() => ({
    transform: [{ scale: ripple3Scale.value }],
    opacity: ripple3Opacity.value,
  }));

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1Y.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2Y.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3Y.value }],
  }));

  // Determine which image to show
  const getStateImage = () => {
    switch (currentState) {
      case VoiceRecordingState.THINKING:
        return VESTA_IMAGES.thinking;
      case VoiceRecordingState.SPEAKING:
        return VESTA_IMAGES.speaking;
      case VoiceRecordingState.LISTENING:
      default:
        return VESTA_IMAGES.listening;
    }
  };

  return (
    <View style={styles.container}>
      {/* Ripple 3 (outermost) */}
      <Animated.View style={[styles.ripple, ripple3Style]} />
      {/* Ripple 2 */}
      <Animated.View style={[styles.ripple, ripple2Style]} />
      {/* Ripple 1 */}
      <Animated.View style={[styles.ripple, ripple1Style]} />
      
      {/* Main visualizer circle */}
      <Animated.View style={[styles.visualizer, circleStyle]}>
        <Image source={getStateImage()} style={styles.stateImage} />
      </Animated.View>
    </View>
  );
}
