import React from "react";
import { router, Tabs } from "expo-router";
import { useAuth } from "@/contexts/auth/AuthContext";

export default function TabsLayout() {
  const {session} = useAuth()
  if(!session?.token)router.replace("/(auth)/login")
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => null}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="rooms" />
      <Tabs.Screen name="pantry" />
      <Tabs.Screen name="recipes" />
      <Tabs.Screen name="shoppingList" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="ai" />
      <Tabs.Screen name="vesta-test" />
    </Tabs>
  );
}
