import React from "react";
import { ScrollView, View, Text } from "react-native";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { termsStyles as styles } from "./TermsScreen.styles";
import HeaderSecondary from "@/components/ui/HeaderSecondary";

export default function TermsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <HeaderSecondary
          theme={theme}
          title="Terms"
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 110 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.header, { color: theme.text }]}>
            Terms of Service
          </Text>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            Welcome to Vesta. By using our application, you agree to these Terms. Please read them carefully.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>
            1. Acceptance of Terms
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            By creating an account or using Vesta, you agree to be bound by these Terms. If you do not agree, do not use our services.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>
            2. Use of Services
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            You are responsible for your account security and all activities that occur under your account. You agree not to misuse our services or help anyone else do so.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>
            3. Content and Conduct
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            We reserve the right to remove any content that violates these Terms or is harmful to our users. You own the content you create and share on Vesta.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>
            4. Termination
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            We may suspend or terminate your access to Vesta at any time, for any reason, if we believe you have violated these terms.
          </Text>
          
           <Text style={[styles.sectionHeader, { color: theme.text }]}>
            5. Changes to Terms
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            We may modify these terms at any time. We will post the most current version on our site. If a revision is meaningful, we will notify you.
          </Text>

        </ScrollView>
      </View>
    </View>
  );
}
