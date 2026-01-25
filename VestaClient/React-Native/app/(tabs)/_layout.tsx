import React from "react";
import { router, Tabs } from "expo-router";
import { useAuth } from "@/React-Native/contexts/auth/AuthContext";
import BottomNav from "@/React-Native/components/ui/BottomNav";
import { useTheme } from "@/React-Native/contexts/theme/ThemeContext";

export default function TabsLayout() {
  const { session } = useAuth();
  const { theme } = useTheme();

  if (!session?.token) router.replace("/(auth)/login");
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => <BottomNav theme={theme} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="rooms" />
      <Tabs.Screen name="pantry" />
      <Tabs.Screen name="recipes" />
      <Tabs.Screen name="shoppingList" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="ai" />

    </Tabs>
  );
}
