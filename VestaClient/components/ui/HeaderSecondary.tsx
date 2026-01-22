import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

interface HeaderSecondaryProps {
  theme: Theme;
  title: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
}

export default function HeaderSecondary(props: HeaderSecondaryProps) {
  const { theme, title, onBack, rightAction } = props;
  const insets = useSafeAreaInsets();

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
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [
          styles.backBtn,
          {
            backgroundColor: theme.surface2,
            borderColor: theme.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={20} color={theme.text} />
      </Pressable>

      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.rightAction}>
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    marginHorizontal: 16,
  },
  rightAction: {
    minWidth: 40, 
    alignItems: 'flex-end',
  },
});
