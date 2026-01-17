import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";

import Card from "@/components/ui/Card";

import { loadingStyles as styles } from "./Loading.styles";
import { theme } from "@/constants/theme";


export default function LoadingScreen() {

  const [trackW, setTrackW] = useState(0);
  const innerW = useMemo(() => Math.max(0, trackW - 4), [trackW]); 

  const load = useRef(new Animated.Value(0)).current; 
  const pulse = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    const loadLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(load, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false, 
        }),
        Animated.timing(load, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    loadLoop.start();
    pulseLoop.start();

    return () => {
      loadLoop.stop();
      pulseLoop.stop();
    };
  }, [load, pulse]);

  const widthFrac = load.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 0.3],
  });

  const translateFrac = load.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-0.4, 0, 0.4],
  });

  const barWidth = innerW ? Animated.multiply(widthFrac, innerW) : 0;
  const barTranslateX = innerW ? Animated.multiply(translateFrac, innerW) : 0;

  const dotScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const dotOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });
  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 0.75],
  });

  return (
    <View style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View
        pointerEvents="none"
        style={[
          styles.glowA,
          { backgroundColor: theme.primaryGlow, borderColor: theme.border },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glowB,
          { backgroundColor: theme.primaryGlow, borderColor: theme.border },
        ]}
      />

      <View style={styles.center}>
        <Card theme={theme} radius={22} style={styles.card}>
          <View
            style={[
              styles.logo,
              { backgroundColor: theme.surface2, borderColor: theme.border },
            ]}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                styles.logoDotGlow,
                {
                  backgroundColor: theme.primaryGlow,
                  transform: [{ scale: glowScale }],
                  opacity: glowOpacity,
                },
              ]}
            />

            <Animated.View
              pointerEvents="none"
              style={[
                styles.logoDot,
                {
                  backgroundColor: theme.primary,
                  transform: [{ scale: dotScale }],
                  opacity: dotOpacity,
                },
              ]}
            />
          </View>

          <Text style={[styles.brand, { color: theme.text }]}>Vesta</Text>
          <Text style={[styles.title, { color: theme.textMuted }]}>
            Warming up your home...
          </Text>

          <View
            style={[
              styles.track,
              { backgroundColor: theme.surface2, borderColor: theme.border },
            ]}
            onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
          >
            <Animated.View
              style={[
                styles.bar,
                {
                  backgroundColor: theme.primary,
                  width: barWidth,
                  transform: [{ translateX: barTranslateX }],
                },
              ]}
            />
          </View>

          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Loading your rooms, pantry, and recipes.
          </Text>
        </Card>
      </View>
    </View>
  );
}
