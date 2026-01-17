import React from "react";
import { Pressable, Text, View } from "react-native";
import { Theme } from "@/type";

import { themeToggleStyles as styles } from "./ThemeToggle.styles";

export type ThemeMode = "Dark" | "Light";

export default function ThemeToggle(props: {
  theme: Theme;
  value: ThemeMode;
  onChange: (v: ThemeMode) => void;
}) {
  const { theme } = props;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.track,
          { backgroundColor: theme.surface2, borderColor: theme.border },
        ]}
      >
        {(["Dark", "Light"] as ThemeMode[]).map((opt) => {
          const active = props.value === opt;

          return (
            <Pressable
              key={opt}
              onPress={() => props.onChange(opt)}
              style={({ pressed }) => [
                styles.segment,
                active && {
                  backgroundColor: theme.bg,
                  borderColor: theme.border,
                  borderWidth: 1,
                },
                { opacity: pressed ? 0.9 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={opt}
            >
              <Text
                style={[
                  styles.text,
                  { color: active ? theme.text : theme.textMuted },
                ]}
              >
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
