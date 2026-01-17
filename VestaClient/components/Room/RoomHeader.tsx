import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "@/type";
import { roomHeaderStyles as styles } from "./RoomHeader.styles";

export default function RoomHeader(props: {
  theme: Theme;
  title: string;
  onBack?: () => void;
  onAddDevice?: () => void;
}) {
  const { theme } = props;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 10,
          backgroundColor: theme.bg,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.left}>
        <Pressable
          onPress={props.onBack}
          style={({ pressed }) => [
            styles.iconBtn,
            {
              backgroundColor: theme.surface2,
              borderColor: theme.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </Pressable>

        <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>
      </View>

      <Pressable
        onPress={props.onAddDevice}
        style={({ pressed }) => [
          styles.addBtn,
          {
            backgroundColor: theme.surface2,
            borderColor: theme.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Add Device"
      >
        <Ionicons name="add" size={16} color={theme.textMuted} />
        <Text style={[styles.addText, { color: theme.textMuted }]}>Add Device</Text>
      </Pressable>
    </View>
  );
}
