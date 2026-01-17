import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Theme } from "@/type";

type PillVariant = "default" | "primary" | "surface";

export default function Pill(props: {
  theme: Theme;
  text: string;
  style?: StyleProp<ViewStyle>;

  variant?: PillVariant; 
  radius?: number;
  paddingX?: number;
  paddingY?: number;
}) {
  const {
    theme,
    variant = "default",
    radius = 999,
    paddingX = 10,
    paddingY = 7,
  } = props;

  const backgroundColor =
    variant === "primary"
      ? theme.primary
      : variant === "surface"
      ? theme.surface2
      : theme.surface2;

  const borderColor = variant === "primary" ? "transparent" : theme.border;

  const textColor = variant === "primary" ? theme.bg : theme.text;

  return (
    <View
      style={[
        styles.pill,
        {
          borderRadius: radius,
          paddingHorizontal: paddingX,
          paddingVertical: paddingY,
          backgroundColor,
          borderColor,
        },
        props.style,
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{props.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "900",
  },
});
