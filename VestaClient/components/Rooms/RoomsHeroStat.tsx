import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";

import { roomsHeroStatStyles as styles } from "./RoomsHeroStat.styles";

export default function RoomsHeroStat(props: {
  theme: Theme;
  label: string;
  value: string;
}) {
  const { theme } = props;
  const isTip = props.label.toLowerCase().includes("tip");

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface2, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.label, { color: theme.textMuted }]}>{props.label}</Text>
      <Text
        style={[
          styles.value,
          isTip && styles.valueTip,
          { color: theme.text },
        ]}
        numberOfLines={1}
      >
        {props.value}
      </Text>
    </View>
  );
}
