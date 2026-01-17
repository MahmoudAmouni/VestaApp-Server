import React from "react";
import { Theme } from "@/type";
import Card from "@/components/Card";

import SettingsNavRow from "./SettingsNavRow";
import { notificationsCardStyles as styles } from "./NotificationsCard.styles";

export default function NotificationsCard(props: {
  theme: Theme;
  items: { title: string; sub: string; onPress: () => void }[];
}) {
  const { theme } = props;

  return (
    <Card theme={theme} padding={0} style={styles.card}>
      {props.items.map((it, idx) => (
        <SettingsNavRow
          key={it.title}
          theme={theme}
          title={it.title}
          sub={it.sub}
          onPress={it.onPress}
          showDivider={idx !== 0}
        />
      ))}
    </Card>
  );
}
