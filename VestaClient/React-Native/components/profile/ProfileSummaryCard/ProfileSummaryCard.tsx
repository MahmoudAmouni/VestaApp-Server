import React from "react";
import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { Theme } from "@/type";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

import { profileSummaryStyles as styles } from "./ProfileSummaryCard.styles";

export default function ProfileSummaryCard(props: {
  theme: Theme;
  name: string;
  homeLabel: string;
  avatar?: string | null;
  onPressEdit: () => void;
  onPressAvatar?: () => void;
}) {
  const { theme, avatar } = props;

  return (
    <Card theme={theme} padding={14} style={styles.card}>
      <View style={styles.topRow}>
        <Pressable
          onPress={props.onPressAvatar}
          style={[
            styles.avatar,
            { backgroundColor: theme.surface2, borderColor: theme.border, overflow: 'hidden' },
          ]}
        >
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <Ionicons name="person-outline" size={18} color={theme.text} />
          )}
        </Pressable>

        <View style={styles.textBlock}>
          <Text style={[styles.name, { color: theme.text }]}>{props.name}</Text>
          <Text style={[styles.sub, { color: theme.textMuted }]}>
            {props.homeLabel}
          </Text>
        </View>
      </View>

      <Button
        variant="primary"
        label="Edit Profile"
        onPress={props.onPressEdit}
        style={styles.editBtn}
      />
    </Card>
  );
}
