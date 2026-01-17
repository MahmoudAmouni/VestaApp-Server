import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Theme } from "@/type";

export default function IconButton(props: {
  theme: Theme;
  label: string;
  onPress: () => void;
  icon: (color: string, size: number) => React.ReactNode;
}) {
  const { theme } = props;

  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={props.label}
      style={({ pressed }) => [
        s.btn,
        {
          borderColor: theme.border,
          backgroundColor: theme.surface2,
          opacity: pressed ? 0.86 : 1,
        },
      ]}
    >
      <View>{props.icon(theme.text, 22)}</View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
