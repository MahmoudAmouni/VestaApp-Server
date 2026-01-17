import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { vestaFABStyles as styles } from './VestaFAB.styles';

interface VestaFABProps {
  isExpanded: boolean;
  onPress: () => void;
}

export default function VestaFAB(props: VestaFABProps) {
  const { isExpanded, onPress } = props;

  return (
    <TouchableOpacity
      style={[styles.fab, isExpanded && styles.fabExpanded]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={isExpanded ? 'Stop recording' : 'Start recording'}
    >
      <Ionicons
        name={isExpanded ? 'stop' : 'mic'}
        size={28}
        color="#FFF"
      />
    </TouchableOpacity>
  );
}
