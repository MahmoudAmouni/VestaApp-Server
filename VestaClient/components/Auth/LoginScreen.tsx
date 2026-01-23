import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import HeaderSecondary from "@/components/ui/HeaderSecondary";
import TextField from "@/components/Auth/TextField/TextField";
import SocialButton from "@/components/Welcome/SocialButton";
import { useAuth } from "@/contexts/auth/AuthContext";
import { GoogleButton } from "../Welcome/GoogleButton";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { loginStyles as styles} from "./Login.styles";

export default function LoginScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.length > 0,
    [email, password]
  );
  const {login,isLoggingIn} = useAuth()

  function onLogin() {
    login({email,password})
  }



  return (
    <View style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View
        pointerEvents="none"
        style={[
          styles.glow,
          {  borderColor: theme.border },
        ]}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingTop: 8, paddingBottom: insets.bottom + 18 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <HeaderSecondary
            theme={theme}
            title="Login"
            onBack={() => router.back()}
          />

          <Card theme={theme} radius={22} style={styles.card}>
            <Text style={[styles.h1, { color: theme.text }]}>
              Pick up where you left off.
            </Text>
            <Text style={[styles.sub, { color: theme.textMuted }]}>
              Your home, recipes, and assistant — ready anytime.
            </Text>

            <View style={styles.form}>
              <TextField
                theme={theme}
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextField
                theme={theme}
                label="Password"
                placeholder="••••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <View style={styles.rememberRow}>
                <Pressable
                  onPress={() => setRemember((v) => !v)}
                  style={({ pressed }) => [
                    styles.rememberLeft,
                    { opacity: pressed ? 0.86 : 1 },
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: remember }}
                  accessibilityLabel="Remember me"
                >
                  <View
                    style={[
                      styles.checkBox,
                      {
                        backgroundColor: remember
                          ? theme.primary
                          : theme.surface2,
                        borderColor: remember ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    {remember ? (
                      <Ionicons name="checkmark" size={14} color={theme.bg} />
                    ) : null}
                  </View>

                  <Text
                    style={[styles.rememberText, { color: theme.textMuted }]}
                  >
                    Remember me
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                  accessibilityRole="button"
                  accessibilityLabel="Forgot password"
                >
                  <Text style={[styles.forgotText, { color: theme.textMuted }]}>
                    Forgot password?
                  </Text>
                </Pressable>
              </View>

              <Button
                
                variant="primary"
                label="Login"
                onPress={onLogin}
                disabled={isLoggingIn}
                loading={isLoggingIn}
                style={{ width: "100%", opacity: canSubmit ? 1 : 0.75 }}
              />

              <Text style={[styles.dividerText, { color: theme.textMuted }]}>
                or continue with
              </Text>

              <View style={styles.socialRow}>
                <GoogleButton />
                <SocialButton
                  label="Facebook"
                  icon="logo-facebook"
                  onPress={() => {}}
                />
              </View>

              <Text style={[styles.footer, { color: theme.textMuted }]}>
                <Text style={{ color: theme.text }}>New to Vesta? </Text>
                <Text
                  style={[styles.footerLink, { color: theme.text }]}
                  onPress={() => router.push("/signup")}
                >
                  Create an account.
                </Text>
              </Text>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
