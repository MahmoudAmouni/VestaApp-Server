import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";
import { roomActionsStyles as styles } from "./RoomActions.styles";

export default function RoomActions(props: {
  theme: Theme;
  onEditRoom?: () => void;
  onDeleteRoom?: () => void;
}) {
  const { theme } = props;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={props.onEditRoom}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: theme.bg,
            borderColor: theme.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Edit Room"
      >
        <View style={styles.btnContent}>
          <Ionicons name="create-outline" size={16} color={theme.text} />
          <Text style={[styles.btnText, { color: theme.text }]}>Edit Room</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={props.onDeleteRoom}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: theme.primary,
            borderColor: "transparent",
            opacity: pressed ? 0.9 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Delete Room"
      >
        <View style={styles.btnContent}>
          <Ionicons name="trash-outline" size={16} color={theme.bg} />
          <Text style={[styles.btnText, { color: theme.bg }]}>Delete Room</Text>
        </View>
      </Pressable>
    </View>
  );
}
