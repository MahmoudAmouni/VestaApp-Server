import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "@/type";

import { headerStyles as styles } from "./Header.styles";
import { router } from "expo-router";
import { useAuth } from "@/contexts/auth/AuthContext";

export default function Header(props: {
  theme: Theme;
  title: string;
  kicker: string;
  onPressProfile?: () => void;
  onPressNotifications?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  function onPressProfilee(){
    router.push("/profile")
  }
  function onPressShoppingList() {
    router.push("/shoppingList");
  }
  const { theme, icon = "grid-outline" } = props;
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  console.log("Avatar URL:", user?.avatar_url);

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 10,
          backgroundColor: theme.navBg,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.logo,
            { backgroundColor: theme.surface2, borderColor: theme.border },
          ]}
        >
          <Ionicons name={icon} size={20} color={theme.text} />
        </View>

        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: theme.text }]}>
            {props.title}
          </Text>
          <Text style={[styles.kicker, { color: theme.textMuted }]}>
            {props.kicker}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={onPressProfilee}
          style={({ pressed }) => [
            styles.iconBtn,
            {
              backgroundColor: theme.surface2,
              borderColor: theme.border,
              opacity: pressed ? 0.85 : 1,
              overflow: 'hidden',
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        >
          {user?.avatar_url ? (
            <Image
              source={{ uri: user.avatar_url }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <Ionicons name="person-outline" size={18} color={theme.text} />
          )}
        </Pressable>

        <Pressable
          onPress={onPressShoppingList}
          style={({ pressed }) => [
            styles.iconBtn,
            {
              backgroundColor: theme.surface2,
              borderColor: theme.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={18} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}
