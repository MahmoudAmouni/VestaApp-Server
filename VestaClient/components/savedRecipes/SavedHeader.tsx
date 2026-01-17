import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Theme } from "@/type";
import { savedHeaderStyles as styles } from "./SavedHeader.styles";

export default function SavedHeader(props: {
  theme: Theme;
  title: string;
  onBack: () => void;
}) {
  const { theme } = props;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 8,
          backgroundColor: theme.bg,
        },
      ]}
    >
      <Pressable
        onPress={props.onBack}
        style={({ pressed }) => [
          styles.backBtn,
          {
            backgroundColor: theme.surface2,
            borderColor: theme.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={18} color={theme.text} />
      </Pressable>

      <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>

      <View style={styles.rightSpacer} />
    </View>
  );
}
