import React, { useEffect, useRef } from "react";
import { Animated, DimensionValue, Easing, ViewStyle } from "react-native";
import { useTheme } from "@/React-Native/contexts/theme/ThemeContext";

export default function Skeleton(props: {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  const { width = "100%", height = 20, borderRadius = 6, style } = props;
  const opacity = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.15,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.textMuted,
          opacity,
        },
        style,
      ]}
    />
  );
}
