import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";

import { profileHeaderStyles as styles } from "./ProfileHeader.styles";

export default function ProfileHeader(props: {
  theme: Theme;
  title: string;
  onBack: () => void;
}) {
  const { theme } = props;

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.navBg, borderColor: theme.border },
      ]}
    >
      <Pressable
        onPress={props.onBack}
        style={({ pressed }) => [
          styles.backBtn,
          {
            backgroundColor: theme.surface,
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
