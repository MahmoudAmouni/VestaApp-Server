import { useEffect } from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { socialButtonStyles as styles } from "./SocialButton.styles";
import { useAuth } from "@/contexts/auth/AuthContext";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useTheme } from "@/contexts/theme/ThemeContext";

WebBrowser.maybeCompleteAuthSession();

export function GoogleButton() {
  const { theme } = useTheme();
  const { googleLogin } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: 'vestaclient',
      path: 'auth'
    }),
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken =
        response.params?.id_token ??
        // @ts-ignore
        response.authentication?.idToken;

      const accessToken =
        response.params?.access_token ??
        response.authentication?.accessToken;

      if (idToken) {
        googleLogin(idToken);
      } else if (accessToken) {
        googleLogin(accessToken, true);
      } else {
        console.error("No id_token or access_token returned from Google");
      }
    }
  }, [response, googleLogin]);

  return (
    <Pressable
      onPress={()=>promptAsync()}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: theme.surface2,
          borderColor: theme.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Google"
    >
      <Ionicons name={"logo-google"} size={18} color={theme.text} />
      <Text style={[styles.text, { color: theme.text }]}>Google</Text>
    </Pressable>
  );
}

