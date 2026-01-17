import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";

import { dangerZoneStyles as styles } from "./DangerZoneActions.styles";

export default function DangerZoneActions(props: {
  theme: Theme;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}) {
  const { theme } = props;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={props.onSignOut}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: theme.surface2,
            borderColor: theme.border,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Sign Out"
      >
        <Ionicons name="log-out-outline" size={16} color={theme.text} />
        <Text style={[styles.btnText, { color: theme.text }]}>Sign Out</Text>
      </Pressable>

      <Pressable
        onPress={props.onDeleteAccount}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Delete Account"
      >
        <Ionicons name="trash-outline" size={16} color={theme.bg} />
        <Text style={[styles.btnText, { color: theme.bg }]}>
          Delete Account
        </Text>
      </Pressable>
    </View>
  );
}
