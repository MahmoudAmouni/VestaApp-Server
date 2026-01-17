import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";
import { featureRowStyles as styles } from "./FeatureRow.styles";

export default function FeatureRow(props: {
  theme: Theme;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  sub: string;
}) {
  const { theme } = props;

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.surface2, borderColor: theme.border },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { borderColor: theme.border, backgroundColor: theme.surface },
        ]}
      >
        <Ionicons name={props.icon} size={16} color={theme.text} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>
        <Text style={[styles.sub, { color: theme.textMuted }]}>
          {props.sub}
        </Text>
      </View>
    </View>
  );
}
