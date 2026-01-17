import React from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { Theme } from "@/type";
import { pantryFilterRowStyles as styles } from "./PantryFilterRow.styles";

export type PantryFilterKey = "All" | "Expiring" | "Fridge" | "Freezer";

const FILTERS: PantryFilterKey[] = [
  "All",
  "Expiring",
  "Fridge",
  "Freezer",
  "Freezer",
  "Freezer",
];

export default function PantryFilterRow(props: {
  theme: Theme;
  value: PantryFilterKey;
  onChange: (k: PantryFilterKey) => void;
}) {
  const { theme } = props;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTERS.map((k, idx) => {
        const active = props.value === k;

        return (
          <Pressable
            key={`${k}-${idx}`}
            onPress={() => props.onChange(k)}
            style={({ pressed }) => [
              styles.pill,
              {
                backgroundColor: active ? theme.surface2 : theme.bg,
                borderColor: active
                  ? theme.borderStrong ?? theme.border
                  : theme.border,
                opacity: pressed ? 0.86 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={k}
          >
            <Text
              style={[
                styles.pillText,
                { color: active ? theme.text : theme.textMuted },
              ]}
            >
              {k}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
