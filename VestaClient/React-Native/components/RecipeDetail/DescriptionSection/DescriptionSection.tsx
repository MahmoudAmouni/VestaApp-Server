import React from "react";
import { Text, View } from "react-native";

import { Theme } from "@/type";
import Card from "@/React-Native/components/ui/Card";

import { descriptionSectionStyles as styles } from "./DescriptionSection.styles";

export default function DescriptionSection(props: {
  theme: Theme;
  text: string;
}) {
  const { theme } = props;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.h, { color: theme.text }]}>Description</Text>
      <Card theme={theme} padding={14}>
        <Text style={[styles.body, { color: theme.textMuted }]}>
          {props.text}
        </Text>
      </Card>
    </View>
  );
}
