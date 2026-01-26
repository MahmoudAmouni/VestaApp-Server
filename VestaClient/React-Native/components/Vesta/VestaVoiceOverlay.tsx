import { useVesta } from '@/features/vesta/useVesta';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import VestaBackdrop from './VestaBackdrop';
import VestaFAB from './VestaFAB';
import VestaVisualizer from './VestaVisualizer';

export function VestaVoiceOverlay() {
  const {
    isExpanded,
    currentState,
    startCall,
    stopCall,
    visualizerAnimations,
    dotAnimations,
  } = useVesta();

  const handleToggle = () => {
    if (!isExpanded) {
      startCall();
    } else {
      stopCall();
    }
  };

  return (
    <View style={styles.container}>
      {isExpanded && (
        <VestaBackdrop onPress={stopCall}>
          <VestaVisualizer
            currentState={currentState}
            scale={visualizerAnimations.scale}
            opacity={visualizerAnimations.opacity}
            ripple1Scale={visualizerAnimations.ripple1Scale}
            ripple1Opacity={visualizerAnimations.ripple1Opacity}
            ripple2Scale={visualizerAnimations.ripple2Scale}
            ripple2Opacity={visualizerAnimations.ripple2Opacity}
            ripple3Scale={visualizerAnimations.ripple3Scale}
            ripple3Opacity={visualizerAnimations.ripple3Opacity}
            dot1Y={dotAnimations.dot1Y}
            dot2Y={dotAnimations.dot2Y}
            dot3Y={dotAnimations.dot3Y}
          />
        </VestaBackdrop>
      )}

      <VestaFAB isExpanded={isExpanded} onPress={handleToggle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: '50%',
    width: '100%',
    maxWidth: 430,
    transform: [
      { translateX: '-50%' }
    ],
    zIndex: 9999,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
    padding: 0,
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
});
