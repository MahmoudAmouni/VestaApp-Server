import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { emptyRoomStateStyles as styles } from "./EmptyRoomState.styles";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";

interface EmptyRoomStateProps {
  theme: Theme;
  onAddRoom: () => void;
}

export default function EmptyRoomState({ theme, onAddRoom }: EmptyRoomStateProps) {
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.surface2 },
        ]}
      >
        <Ionicons name="bed-outline" size={24} color={theme.textMuted} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          No rooms found
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          It looks like you haven't added any rooms yet.
        </Text>
      </View>
      <TouchableOpacity
        onPress={onAddRoom}
        activeOpacity={0.8}
        style={[styles.button, { backgroundColor: theme.primary }]}
      >
        <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
          Create Room
        </Text>
      </TouchableOpacity>
    </View>
  );
}

