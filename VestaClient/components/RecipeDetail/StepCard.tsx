import React from "react";
import { Text, View } from "react-native";

import Card from "@/components/Card";
import { stepCardStyles as styles } from "./StepCard.styles";
import { theme } from "@/constants/theme";

export default function StepCard(props: {
  index: number;
  title: string;
}) {
  const { title } = props;

  return (
    <Card theme={theme} padding={14} style={styles.card}>
      <View style={styles.headRow}>
        <View style={styles.leftHead}>
          <View
            style={[
              styles.numBox,
              { backgroundColor: theme.surface2, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.num, { color: theme.text }]}>
              {props.index}
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {title}
          </Text>
        </View>
      </View>
    </Card>
  );
}
