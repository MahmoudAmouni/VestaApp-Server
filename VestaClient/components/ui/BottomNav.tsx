import { Theme } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { bottomstyles as styles } from "./BottomNav.styles";

type NavKey = "Home" | "Rooms" | "Pantry" | "Recipes" | "AI" | "Profile";

const ROUTES: Record<NavKey, string> = {
  Home: "/",
  Rooms: "/rooms",
  Pantry: "/pantry",
  Recipes: "/recipes",
  AI: "/ai",
  Profile: "/profile",
};

export default function BottomNav(props: { theme: Theme }) {
  const { theme } = props;
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const active: NavKey = useMemo(() => {
    if (pathname === "/" || pathname.startsWith("/index")) return "Home";
    if (pathname.startsWith("/rooms")) return "Rooms";
    if (pathname.startsWith("/pantry")) return "Pantry";
    if (pathname.startsWith("/recipes")) return "Recipes";
    if (pathname.startsWith("/ai")) return "AI";
    if (pathname.startsWith("/profile")) return "Profile";
    return "Home";
  }, [pathname]);

  const items: {
    key: NavKey;
    label: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    iconActive: React.ComponentProps<typeof Ionicons>["name"];
  }[] = [
    { key: "Home", label: "Home", icon: "grid-outline", iconActive: "grid" },
    { key: "Rooms", label: "Rooms", icon: "bed-outline", iconActive: "bed" },
    {
      key: "Pantry",
      label: "Pantry",
      icon: "basket-outline",
      iconActive: "basket",
    },
    {
      key: "Recipes",
      label: "Recipes",
      icon: "restaurant-outline",
      iconActive: "restaurant",
    },
    {
      key: "AI",
      label: "AI",
      icon: "sparkles-outline",
      iconActive: "sparkles",
    },
  ];

  function goTo(key: NavKey) {
    const href = ROUTES[key];
    router.replace(href as any);
  }

  return (
    <View style={{ backgroundColor: theme.navBg ?? theme.bg, paddingBottom: insets.bottom }}>
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: theme.navBg ?? theme.bg,
            borderColor: theme.border,
            paddingBottom: 8,
          },
        ]}
      >
        {items.map((it) => {
          const isActive = active === it.key;

          return (
            <Pressable
              key={it.key}
              onPress={() => goTo(it.key)}
              style={({ pressed }) => [
                styles.navItem,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={it.label}
            >
              <View
                style={[
                  styles.navIconWrap,
                  isActive && {
                    backgroundColor: theme.surface2,
                    borderColor: theme.borderStrong ?? theme.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <View
                  style={
                    isActive
                      ? {
                          backgroundColor: theme.primary,
                          padding: 4,
                          borderRadius: 6,
                        }
                      : undefined
                  }
                >
                  <Ionicons
                    name={isActive ? it.iconActive : it.icon}
                    size={20}
                    color={isActive ? "#fff" : theme.textMuted}
                  />
                </View>
              </View>

              <Text
                style={[
                  styles.navText,
                  { color: isActive ? theme.text : theme.textMuted },
                ]}
              >
                {it.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
