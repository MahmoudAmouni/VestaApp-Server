import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";

import Card from "@/components/Card";

import { settingsSectionStyles as styles } from "./SettingsSection.styles";
import SettingsRow from "./SettingsRow";

export type SettingsItem = {
  title: string;
  sub: string;
  onPress: () => void;
};

export default function SettingsSection(props: {
  theme: Theme;
  title: string;
  items: SettingsItem[];
}) {
  const { theme } = props;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>

      <Card theme={theme} padding={0} style={styles.card}>
        {props.items.map((it, idx) => (
          <SettingsRow
            key={`${props.title}-${it.title}`}
            theme={theme}
            title={it.title}
            sub={it.sub}
            showDivider={idx !== 0}
            onPress={it.onPress}
          />
        ))}
      </Card>
    </View>
  );
}
