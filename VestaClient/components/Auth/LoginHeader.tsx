import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";
import { headerStyles as styles } from "./LoginHeader.styles";

export default function LoginHeader(props: {
  theme: Theme;
  title: string;
  onBack: () => void;
}) {
  const { theme } = props;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={props.onBack}
        style={({ pressed }) => [
          styles.backBtn,
          {
            backgroundColor: theme.surface2,
            borderColor: theme.border,
            opacity: pressed ? 0.86 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={18} color={theme.text} />
      </Pressable>

      <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>
    </View>
  );
}
