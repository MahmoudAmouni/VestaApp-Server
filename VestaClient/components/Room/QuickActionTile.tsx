import React from "react";
import { Pressable, Text } from "react-native";
import { Theme } from "@/type";
import { quickActionTileStyles as styles } from "./QuickActionTile.styles";

export default function QuickActionTile(props: {
  theme: Theme;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const { theme } = props;

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.wrap,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${props.label}: ${props.value}`}
    >
      <Text style={[styles.label, { color: theme.textMuted }]}>
        {props.label}
      </Text>
      <Text style={[styles.value, { color: theme.text }]}>{props.value}</Text>
    </Pressable>
  );
}
