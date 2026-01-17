import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";

import { tagRowStyles as styles } from "./TagRow.styles";

export default function TagRow(props: {
  theme: Theme;
  label: string;
  onRemove: () => void;
}) {
  const { theme } = props;

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.surface2, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.text, { color: theme.text }]} numberOfLines={1}>
        {props.label}
      </Text>

      <Pressable
        onPress={props.onRemove}
        style={({ pressed }) => [
          styles.trashBtn,
          {
            backgroundColor: theme.primary,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${props.label}`}
      >
        <Ionicons name="trash-outline" size={16} color={theme.bg} />
      </Pressable>
    </View>
  );
}
