import { VESTA_CONFIG } from '@/constants/vesta.constants';
import { StyleSheet } from 'react-native';

export const vestaVisualizerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
  visualizer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: VESTA_CONFIG.COLORS.primary,
    shadowColor: VESTA_CONFIG.COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: VESTA_CONFIG.COLORS.primary,
  },
  stateImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});
