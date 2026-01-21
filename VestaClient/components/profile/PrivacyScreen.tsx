import React from "react";
import { ScrollView, View, Text } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/contexts/theme/ThemeContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { profileStyles as styles } from "./ProfileScreen.styles";

export default function PrivacyScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <ProfileHeader
          theme={theme}
          title="Privacy"
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 110 + insets.bottom, paddingTop: 24, paddingHorizontal: 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>
            Privacy Policy
          </Text>

          <Text style={{ color: theme.text, fontSize: 16, lineHeight: 24, marginBottom: 24 }}>
            At Vesta, we take your privacy seriously. This policy describes how we collect, use, and handle your information when you use our services.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12, fontSize: 18 }]}>
            1. Information We Collect
          </Text>
          <Text style={{ color: theme.text, fontSize: 16, lineHeight: 24, marginBottom: 24 }}>
            We collect information you provide directly to us, such as your name, email address, home configuration, and pantry items. We also collect data about your device usage within the app to improve your experience.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12, fontSize: 18 }]}>
            2. How We Use Your Data
          </Text>
          <Text style={{ color: theme.text, fontSize: 16, lineHeight: 24, marginBottom: 24 }}>
            We use your data to:
            {"\n"}• Provide and improve our services
            {"\n"}• Sync your home state across devices
            {"\n"}• Provide personalized recipe suggestions
            {"\n"}• Send critical alerts about your home or food expiry
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12, fontSize: 18 }]}>
            3. Data Retention
          </Text>
          <Text style={{ color: theme.text, fontSize: 16, lineHeight: 24, marginBottom: 24 }}>
            We retain your data for as long as your account is active. You can delete your account and all associated data at any time from the Profile screen's Danger Zone.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12, fontSize: 18 }]}>
            4. Contact Us
          </Text>
          <Text style={{ color: theme.text, fontSize: 16, lineHeight: 24, marginBottom: 24 }}>
            If you have questions about this policy, please contact us at privacy@vesta.app.
          </Text>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
