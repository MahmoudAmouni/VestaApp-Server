import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";

import { Theme } from "@/type";
import BottomNav from "@/components/BottomNav";
import { settingsStyles as styles } from "./SettingsScreen.styles";
import ThemeToggle, { ThemeMode } from "@/components/Settings/ThemeToggle";
import SettingsHeader from "@/components/Settings/SettingsHeader";
import InlineInputActionRow from "@/components/Settings/InlineInputActionRow";
import NotificationsCard from "@/components/Settings/NotificationsCard";
import TagsManagerSection from "@/components/Settings/TagsManagerSection";

const darkTheme: Theme = {
  bg: "#0F0F12",
  surface: "#15151B",
  surface2: "#1B1B23",
  text: "#f3f3f6",
  textMuted: "rgba(243, 243, 246, 0.68)",
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.16)",
  primary: "#c45b3d",
  primaryGlow: "rgba(196, 91, 61, 0.20)",
  navBg: "rgba(15, 15, 18, 0.82)",
  shadow1: "rgba(0,0,0,0.35)",
};

export default function SettingsScreen() {
  const theme = darkTheme;
  const insets = useSafeAreaInsets();

  const [homeName, setHomeName] = useState("My Home");
  const [diet, setDiet] = useState("High Protein");

  const [mode, setMode] = useState<ThemeMode>("Dark");

  const [allergyDraft, setAllergyDraft] = useState("");
  const [allergies, setAllergies] = useState<string[]>([
    "Eggs",
    "Milk",
    "Mustard",
    "Peanuts",
  ]);

  const [dislikedDraft, setDislikedDraft] = useState("");
  const [disliked, setDisliked] = useState<string[]>(["Avocado Toast"]);

  const notificationItems = useMemo(
    () => [
      {
        title: "Expiry reminders",
        sub: "Get notified before food expires",
        onPress: () => {},
      },
      {
        title: "Device alerts",
        sub: "Offline or status changes",
        onPress: () => {},
      },
      {
        title: "AI suggestions",
        sub: "Recipe ideas & pantry tips",
        onPress: () => {},
      },
    ],
    []
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <SettingsHeader
          theme={theme}
          title="Settings"
          onBack={() => router.back()}
        />

        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: 110 + insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Home Settings
              </Text>

              <InlineInputActionRow
                theme={theme}
                value={homeName}
                onChangeText={setHomeName}
                placeholder="Home name..."
                actionLabel="Save"
                onPressAction={() => {}}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Notifications
              </Text>

              <NotificationsCard theme={theme} items={notificationItems} />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Theme
              </Text>

              <ThemeToggle theme={theme} value={mode} onChange={setMode} />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Diet
              </Text>

              <InlineInputActionRow
                theme={theme}
                value={diet}
                onChangeText={setDiet}
                placeholder="Diet..."
                actionLabel="Save"
                onPressAction={() => {}}
              />
            </View>

            <TagsManagerSection
              theme={theme}
              title="Allergies"
              inputValue={allergyDraft}
              onChangeInput={setAllergyDraft}
              inputPlaceholder="Allergies..."
              actionLabel="Add"
              items={allergies}
              onAdd={() => {
                const v = allergyDraft.trim();
                if (!v) return;
                setAllergies((prev) => [v, ...prev]);
                setAllergyDraft("");
              }}
              onRemove={(name) =>
                setAllergies((prev) => prev.filter((x) => x !== name))
              }
            />

            <TagsManagerSection
              theme={theme}
              title="Disliked"
              inputValue={dislikedDraft}
              onChangeInput={setDislikedDraft}
              inputPlaceholder="disliked Recipes..."
              actionLabel="Add"
              items={disliked}
              onAdd={() => {
                const v = dislikedDraft.trim();
                if (!v) return;
                setDisliked((prev) => [v, ...prev]);
                setDislikedDraft("");
              }}
              onRemove={(name) =>
                setDisliked((prev) => prev.filter((x) => x !== name))
              }
            />
          </ScrollView>
        </KeyboardAvoidingView>

        <BottomNav theme={theme} />
      </View>
    </SafeAreaView>
  );
}
