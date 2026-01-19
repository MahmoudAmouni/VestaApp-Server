import * as NavigationBar from "expo-navigation-bar";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/contexts/auth/AuthProvider";
import { ThemeProvider as AppThemeProvider } from "@/contexts/theme/ThemeProvider";

import { queryClient, setupReactQueryFocus } from "@/lib/reactQuery";

import { VestaVoiceOverlay } from "@/components/Vesta/VestaVoiceOverlay";
import { useAuth } from "@/contexts/auth/AuthContext";

const BG = "#0f0f12";

const NavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: BG,
    card: BG,
  },
};

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
      router.replace("/(auth)/login");
      return;
    }

    if (isAuthed && inAuth) {
      router.replace("/(tabs)");
      return;
    }
  }, [isLoading, isAuthed, segments.join("|"), router]);

  if (isLoading) return null; 

  return <>{children}</>;
}



function AuthenticatedOverlay() {
  const { session } = useAuth();
  if (!session?.token) return null;
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
          </RouteGuard>
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
