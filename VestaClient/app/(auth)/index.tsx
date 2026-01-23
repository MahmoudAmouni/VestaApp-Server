import React from "react";
import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { welcomeStyles as styles } from "./Welcome.styles";
import BrandRow from "@/components/Welcome/BrandRow";
import FeatureRow from "@/components/Welcome/FeatureRow";
import { GoogleButton } from "@/components/Welcome/GoogleButton";
import { useTheme } from "@/contexts/theme/ThemeContext";

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: theme.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 18 },
        ]}
      >
        <BrandRow theme={theme} />

        <View style={{ flex: 1, justifyContent: "center", width: "100%", alignItems: "center" }}>
          <Card theme={theme} radius={22} style={styles.mainCard}>
            <Text style={[styles.h1, { color: theme.text }]}>
              Make your home feel effortless.
            </Text>

            <Text style={[styles.p, { color: theme.textMuted }]}>
              Control devices, track pantry expiry, and get recipes that match
              what you have with a friendly AI.
            </Text>

            <View style={styles.featureList}>
              <FeatureRow
                theme={theme}
                icon="home-outline"
                title="Home Control"
                sub="Simple ON / OFF by room"
              />
              <FeatureRow
                theme={theme}
                icon="book-outline"
                title="Recipe ideas"
                sub="Recipe ideas"
              />
              <FeatureRow
                theme={theme}
                icon="chatbubble-outline"
                title="Ask Vesta"
                sub="Recipes, tips, and planning"
              />
            </View>

            <View style={styles.ctaRow}>
              <Button
                variant="primary"
                label="Login"
                onPress={() => router.push("/login")}
                style={{ flex: 1 }}
              />
              <Button
                variant="secondary"
                label="Sign up"
                onPress={() => router.push("/signup")}
                style={{ flex: 1 }}
              />
            </View>

            <Text style={[styles.dividerText, { color: theme.textMuted }]}>
              or continue with
            </Text>

            <View style={styles.socialRow}>
              <GoogleButton />
            </View>

            <Text style={[styles.legal, { color: theme.textMuted }]}>
              By continuing, you agree to our{" "}
              <Text
                style={[styles.legalLink, { color: theme.text }]}
                //   onPress={() => router.push("/terms")}
              >
                Terms
              </Text>{" "}
              and{" "}
              <Text
                style={[styles.legalLink, { color: theme.text }]}
                  onPress={() => router.push("/privacy")}
              >
                Privacy
              </Text>
              .
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
