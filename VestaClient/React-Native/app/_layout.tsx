import * as NavigationBar from "expo-navigation-bar";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import Toast, { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";
import { darkTheme } from "@/constants/theme";

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#FF453A",
        backgroundColor: darkTheme.surface2,
        height: 60,
        width: "90%",
        maxWidth: 400,
        borderRadius: 12,
        borderColor: darkTheme.border,
        borderWidth: 1,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
        color: darkTheme.text,
      }}
      text2Style={{
        fontSize: 14,
        color: darkTheme.textMuted,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#FF453A",
        backgroundColor: darkTheme.surface2,
        height: 60,
        width: "90%",
        maxWidth: 380,
        borderRadius: 12,
        borderColor: darkTheme.border,
        borderWidth: 1,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
        color: darkTheme.text,
      }}
      text2Style={{
        fontSize: 14,
        color: darkTheme.textMuted,
      }}
    />
  ),
};
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/React-Native/contexts/auth/AuthProvider";
import { ThemeProvider as AppThemeProvider } from "@/React-Native/contexts/theme/ThemeProvider";

import { queryClient, setupReactQueryFocus } from "@/React-Native/lib/reactQuery";

import { VestaVoiceOverlay } from "@/React-Native/components/Vesta/VestaVoiceOverlay";
import { useAuth } from "@/React-Native/contexts/auth/AuthContext";

const BG = "#0f0f12";

const NavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: BG,
    card: BG,
  },
};

import LoadingScreen from "./(auth)/loading";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();

  const { session, isLoading } = useAuth(); 
  const isAuthed = !!session?.token;

  useEffect(() => {
    if (isLoading) return;

    const group = segments[0]; 
    const inAuth = group === "(auth)";
    const inTabs = group === "(tabs)";

    if (!isAuthed && inTabs) {
      router.replace("/(auth)");
      return;
    }

    if (isAuthed && inAuth) {
      router.replace("/(tabs)");
      return;
    }
  }, [isLoading, isAuthed, segments.join("|"), router]);

  if (isLoading) return <LoadingScreen />; 

  return <>{children}</>;
}



function AuthenticatedOverlay() {
  const { session } = useAuth();
  const segments = useSegments();
  
  const hideMic = segments.some(seg => 
    seg === 'ai' || 
    seg === 'profile' || 
    seg === 'privacy' || 
    seg === 'about'
  );
  
  if (!session?.token || hideMic) return null;
  return <VestaVoiceOverlay />;
}


export default function RootLayout() {
  useEffect(() => {
    const cleanupFocus = setupReactQueryFocus();

    (async () => {
      if (Platform.OS !== "android") return;
      await NavigationBar.setBackgroundColorAsync(BG);
      await NavigationBar.setButtonStyleAsync("light");
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("inset-swipe");
    })();

    return cleanupFocus;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <RouteGuard>
              <ThemeProvider value={NavTheme}>
                <StatusBar style="light" backgroundColor={BG} />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: BG },
                  }}
                >
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
              </ThemeProvider>
              <AuthenticatedOverlay />
              <Toast config={toastConfig} />
          </RouteGuard>
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
