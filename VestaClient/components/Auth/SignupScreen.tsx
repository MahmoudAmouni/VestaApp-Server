import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { signupStyles as styles } from "./Signup.styles";
import LoginHeader from "@/components/Auth/LoginHeader";
import TextField from "@/components/Auth/TextField";
import SocialButton from "@/components/Welcome/SocialButton";
import { useAuth } from "@/contexts/auth/AuthContext";
import { GoogleButton } from "../Welcome/GoogleButton";
import { useTheme } from "@/contexts/theme/ThemeContext";



export default function SignupScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {register} = useAuth()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [homeName, setHomeName] = useState("");
  const [agree, setAgree] = useState(false);

  

  function onCreateAccount(){
    register({name,email,password,home_name:homeName})
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View
        pointerEvents="none"
        style={[
          styles.glow,
          { backgroundColor: theme.primaryGlow, borderColor: theme.border },
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
            { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 18 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <LoginHeader
            theme={theme}
            title="Sign up"
            onBack={() => router.back()}
          />

          <Card theme={theme} radius={22} style={styles.card}>
            <Text style={[styles.h1, { color: theme.text }]}>
              Let’s set up your home.
            </Text>
            <Text style={[styles.sub, { color: theme.textMuted }]}>
              One account, one home devices, pantry, and recipes stay together.
            </Text>

            <View style={styles.form}>
              

              <TextField
                theme={theme}
                label="Name"
                placeholder="e.g. John Doe"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
              />

              <TextField
                theme={theme}
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={{ gap: 6 }}>
                <TextField
                  theme={theme}
                  label="Password"
                  placeholder="••••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <Text style={[styles.helper, { color: theme.textMuted }]}>
                  Use 8+ characters. Mix letters and numbers.
                </Text>
              </View>

              <TextField
                theme={theme}
                label="Home name"
                placeholder="My Home"
                value={homeName}
                onChangeText={setHomeName}
                autoCapitalize="words"
              />

              <Pressable
                onPress={() => setAgree((v) => !v)}
                style={({ pressed }) => [
                  styles.termsRow,
                  { opacity: pressed ? 0.86 : 1 },
                ]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: agree }}
                accessibilityLabel="Agree to Terms and Privacy"
              >
                <View
                  style={[
                    styles.checkBox,
                    {
                      backgroundColor: agree ? theme.primary : theme.surface2,
                      borderColor: agree ? theme.primary : theme.border,
                    },
                  ]}
                >
                  {agree ? (
                    <Ionicons name="checkmark" size={14} color={theme.bg} />
                  ) : null}
                </View>

                <Text style={[styles.termsText, { color: theme.textMuted }]}>
                  I agree to the{" "}
                  <Text
                    style={[styles.termsLink, { color: theme.text }]}
                    // onPress={() => router.push("/terms")}
                  >
                    Terms
                  </Text>{" "}
                  and{" "}
                  <Text
                    style={[styles.termsLink, { color: theme.text }]}
                    // onPress={() => router.push("/privacy")}
                  >
                    Privacy
                  </Text>
                </Text>
              </Pressable>

              <Button
                theme={theme}
                variant="primary"
                label="Create account"
                onPress={onCreateAccount}
              />

              <Text style={[styles.dividerText, { color: theme.textMuted }]}>
                or continue with
              </Text>

              <View style={styles.socialRow}>
                <GoogleButton />
                <SocialButton
                  theme={theme}
                  label="Facebook"
                  icon="logo-facebook"
                  onPress={() => {}}
                />
              </View>

              <Text style={[styles.footer, { color: theme.textMuted }]}>
                <Text style={{ color: theme.textMuted }}>
                  Already have an account?{" "}
                </Text>
                <Text
                  style={[styles.footerLink, { color: theme.text }]}
                  onPress={() => router.push("/login")}
                >
                  Login
                </Text>
              </Text>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
