import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";

import { settingsNavRowStyles as styles } from "./SettingsNavRow.styles";

export default function SettingsNavRow(props: {
  theme: Theme;
  title: string;
  sub: string;
  onPress: () => void;
  showDivider?: boolean;
}) {
  const { theme } = props;

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.row,
        props.showDivider && {
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
        { opacity: pressed ? 0.88 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={props.title}
    >
      <View style={styles.left}>
        <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>
        <Text style={[styles.sub, { color: theme.textMuted }]}>
          {props.sub}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
    </Pressable>
  );
}
