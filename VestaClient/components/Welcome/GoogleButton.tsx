import { useEffect } from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { socialButtonStyles as styles } from "./SocialButton.styles";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/auth/AuthContext";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export function GoogleButton() {
  const { googleLogin } = useAuth();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, 
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken =
        response.params?.id_token ??
        // some SDK versions put it here:
        // @ts-ignore
        response.authentication?.idToken;

      if (!idToken) throw new Error("No id_token returned from Google");
      googleLogin(idToken);
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

