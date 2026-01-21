import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";
import { brandRowStyles as styles } from "./BrandRowStyles";

export default function BrandRow(props: { theme: Theme }) {
  const { theme } = props;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.mark,
          {
            backgroundColor: theme.surface2,
            borderColor: theme.border,
          },
        ]}
      />
      <Text style={[styles.text, { color: theme.text }]}>Vesta</Text>
    </View>
  );
}
