import { VESTA_CONFIG } from '@/constants/vesta.constants';
import { StyleSheet } from 'react-native';

export const vestaFABStyles = StyleSheet.create({
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: VESTA_CONFIG.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabExpanded: {
    backgroundColor: '#FF4444', 
    transform: [{ scale: 1.1 }],
  },
});
