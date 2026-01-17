import React from "react";
import { Text, View } from "react-native";

import { Theme } from "@/type";

import { ingredientRowStyles as styles } from "./IngredientRow.styles";

export default function IngredientRow(props: {
  theme: Theme;
  name: string;
}) {
  const { theme } = props;

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.surface2, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.name, { color: theme.text }]}>{props.name}</Text>


    </View>
  );
}
