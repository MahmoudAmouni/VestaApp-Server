import { Theme } from "@/type";
import React from "react";
import { Text, View } from "react-native";
import Card from "./Card";
import { heroCardStyles as styles } from "./HeroCard.styles";
import KPI from "./KPI";

type HeroKpi = {
  label: string;
  value: string;
  hint?: string;
};

export default function HeroCard(props: {
  theme: Theme;
  kicker?: string;
  title: string;
  sub?: string;
  badge?: React.ReactNode;
  kpis?: HeroKpi[];
  children?: React.ReactNode;
}) {
  const { theme } = props;

  return (
    <Card
      theme={theme}
      style={[
        styles.heroCard,
        {
          backgroundColor: theme.surface,
        },
      ]}
    >
      <View style={styles.heroTop}>
        <View style={{ flex: 1 }}>
          {props.kicker ? (
            <Text style={[styles.heroKicker, { color: theme.textMuted }]}>
              {props.kicker.toUpperCase()}
            </Text>
          ) : null}

          <Text style={[styles.heroTitle, { color: theme.text }]}>
            {props.title}
          </Text>

          {props.sub ? (
            <Text style={[styles.heroSub, { color: theme.textMuted }]}>
              {props.sub}
            </Text>
          ) : null}
        </View>

        {props.badge ? <View>{props.badge}</View> : null}
      </View>

      {props.children ? (
        <View style={{ marginTop: 12 }}>{props.children}</View>
      ) : null}

      {props.kpis?.length ? (
        <View style={styles.kpis}>
          {props.kpis.map((k) => (
            <KPI
              key={`${k.label}-${k.value}`}
              theme={theme}
              label={k.label}
              value={k.value}
              hint={k.hint ?? ""}
            />
          ))}
        </View>
      ) : null}
    </Card>
  );
}
