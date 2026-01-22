import React from 'react';
import { TouchableOpacity } from 'react-native';
import { vestaBackdropStyles as styles } from './VestaBackdropStyles';

interface VestaBackdropProps {
  onPress: () => void;
  children: React.ReactNode;
}

export default function VestaBackdrop(props: VestaBackdropProps) {
  const { onPress, children } = props;

  return (
    <TouchableOpacity
      style={styles.backdrop}
      activeOpacity={1}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Close voice assistant"
    >
      {children}
    </TouchableOpacity>
  );
}
