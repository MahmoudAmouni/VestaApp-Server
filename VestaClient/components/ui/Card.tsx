import React from "react";
import { Platform, StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { Theme } from "@/type";

export default function Card(props: {
  theme: Theme;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;

  padding?: number; 
  radius?: number; 
  noShadow?: boolean; 
}) {
  const { theme, padding = 18, radius = 18, noShadow = false } = props;

  return (
    <View
      style={[
        styles.card,
        noShadow && styles.noShadow,
        {
          padding,
          borderRadius: radius,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.shadow1,
        },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.25,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  noShadow: Platform.select({
    ios: { shadowOpacity: 0 },
    android: { elevation: 0 },
    default: {},
  }) as ViewStyle,
});
