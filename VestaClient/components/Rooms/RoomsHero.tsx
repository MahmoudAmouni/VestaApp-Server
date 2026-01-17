import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";

import Card from "../ui/Card";
import HeroStat from "./RoomsHeroStat";
import { roomsHeroStyles as styles } from "./RoomsHero.styles";

type Stat = {
  label: string;
  value: string;
};

export default function RoomsHero(props: {
  theme: Theme;
  title: string;
  sub: string;
  stats: Stat[];
}) {
  const { theme } = props;

  return (
    <Card theme={theme} padding={16} radius={18}>
      <View style={styles.top}>
        <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>
        <Text style={[styles.sub, { color: theme.textMuted }]}>{props.sub}</Text>
      </View>

      <View style={styles.grid}>
        {props.stats.map((s) => (
          <HeroStat
            key={s.label}
            theme={theme}
            label={s.label}
            value={s.value}
          />
        ))}
      </View>
    </Card>
  );
}
