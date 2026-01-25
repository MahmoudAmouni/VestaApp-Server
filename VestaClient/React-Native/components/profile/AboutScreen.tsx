import React from "react";
import { ScrollView, View, Text } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/React-Native/contexts/theme/ThemeContext";
import { profileStyles as styles } from "./ProfileScreen.styles";
import BrandRow from "../Welcome/BrandRow";
import HeaderSecondary from "../ui/HeaderSecondary";

export default function AboutScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <HeaderSecondary
          theme={theme}
          title="About Vesta"
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 24, paddingTop: 24, paddingHorizontal: 24, alignItems: "center" },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: 32, alignItems: "center" }}>
            <BrandRow theme={theme} />
            <Text style={{ color: theme.textMuted, marginTop: 16 }}>Version 1.0.0</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12, width: '100%', textAlign: 'left' }]}>
            Our Mission
          </Text>
          <Text style={{ color: theme.text, fontSize: 16, lineHeight: 24, marginBottom: 32, width: '100%' }}>
            Vesta is designed to simplify your home management. From tracking pantry inventory to controlling your smart devices, we aim to bring peace and organization to your daily life.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12, width: '100%', textAlign: 'left' }]}>
            Credits
          </Text>
          <Text style={{ color: theme.text, fontSize: 16, lineHeight: 24, marginBottom: 8, width: '100%' }}>
            Designed & Developed by the Vesta Team.
          </Text>
          <Text style={{ color: theme.text, fontSize: 16, lineHeight: 24, marginBottom: 32, width: '100%' }}>
            © 2026 Vesta Inc. All rights reserved.
          </Text>
        </ScrollView>

        <View style={{ width: '100%', paddingHorizontal: 24, paddingBottom: insets.bottom + 16 }}>
          <View style={{ width: '100%', height: 1, backgroundColor: theme.border, marginBottom: 16 }} />
          <Text style={{ color: theme.textMuted, fontSize: 14, textAlign: 'center' }}>
            Made with ❤️ for a smarter home.
          </Text>
        </View>
      </View>
    </View>
  );
}
