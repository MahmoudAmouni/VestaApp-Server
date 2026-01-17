import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Theme } from "@/type";
import Card from "@/components/Card";
import Button from "@/components/Button";

import { profileSummaryStyles as styles } from "./ProfileSummaryCard.styles";

export default function ProfileSummaryCard(props: {
  theme: Theme;
  name: string;
  homeLabel: string;
  onPressEdit: () => void;
}) {
  const { theme } = props;

  return (
    <Card theme={theme} padding={14} style={styles.card}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.surface2, borderColor: theme.border },
          ]}
        >
          <Ionicons name="person-outline" size={18} color={theme.text} />
        </View>

        <View style={styles.textBlock}>
          <Text style={[styles.name, { color: theme.text }]}>{props.name}</Text>
          <Text style={[styles.sub, { color: theme.textMuted }]}>
            {props.homeLabel}
          </Text>
        </View>
      </View>

      <Button
        theme={theme}
        variant="primary"
        label="Edit Profile"
        onPress={props.onPressEdit}
        style={styles.editBtn}
      />
    </Card>
  );
}
