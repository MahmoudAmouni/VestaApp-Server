import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { Theme } from "@/type";
import { bulkActionStyles as styles } from "./BulkActionButton.styles";

export default function BulkActionButton(props: {
  theme: Theme;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}) {
  const { theme } = props;

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
          opacity: pressed ? 0.9 : 1,
        },
        props.style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={props.label}
    >
      <Text style={[styles.text, { color: theme.text }]}>{props.label}</Text>
    </Pressable>
  );
}
