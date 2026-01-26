import React from "react";
import { Text, View } from "react-native";

import { Theme } from "@/type";
import Card from "@/components/ui/Card";

import { quickStatsCardStyles as styles } from "./QuickStatsCard.styles";

export type QuickStat = { label: string; value: string | undefined | number };

export default function QuickStatsCard(props: {
  theme: Theme;
  title: string;
  subtitle: string;
  stats: QuickStat[];
}) {
  const { theme } = props;

  return (
    <Card theme={theme} padding={14} style={styles.card}>
      <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>
      <Text style={[styles.sub, { color: theme.textMuted }]}>
        {props.subtitle}
      </Text>

      <View style={styles.grid}>
        {props.stats.map((s) => (
          <View
            key={s.label}
            style={[
              styles.stat,
              { backgroundColor: theme.surface2, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              {s.label}
            </Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {s.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
