import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import BottomNav from "@/components/ui/BottomNav";
import Header from "@/components/ui/Header";
import HeroCard from "@/components/ui/HeroCard";

import AllItemsSection from "@/components/Pantry/AllItemsSection";
import ExpiringSoonSection from "@/components/Pantry/ExpiringSoonSection";
import PantryFilterRow, {
  PantryFilterKey,
} from "@/components/Pantry/PantryFilterRow";
import PantrySearchBar from "@/components/Pantry/PantrySearchBar";
import { usePantryQuery } from "@/features/pantry/pantry.query";
import { pantryScreenStyles as styles } from "./pantry.styles";
import PantryItemSheet from "./PantryItemSheet";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";

export default function PantryScreen() {
  const { theme } = useTheme();
  const {homeId} = useAuth()
  const { data: pantryItems = [], isLoading, error } = usePantryQuery({ homeId });
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PantryFilterKey>("All");
  
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    let items = pantryItems;
    
    if (q.length > 0) {
      items = items.filter((it) => {
        const name = (it.item_name?.name ?? "").toLowerCase();
        return name.includes(q);
      });
    }

    if (filter !== "All") {
      items = items.filter((it) => (it.location?.name ?? "") === filter);
    }

    return items;
  }, [pantryItems, query, filter]);

  if (isLoading)
    return (
        <Text>Loading....</Text>
      );
    const expiringSoon = getExpiringSoon(pantryItems)

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.screen, { backgroundColor: theme.bg }]}>
        <Header theme={theme} title="Vesta" kicker="Pantry" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 110 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <HeroCard
            theme={theme}
            title="Cook from what's inside."
            sub="Keep it simple: add items, check expiry, and let Vesta suggest meals."
            kpis={[
              { label: "Expiring soon", value: String(expiringSoon.length) },
              { label: "Pantry Items", value: String(pantryItems.length) },
            ]}
          />

          <PantrySearchBar theme={theme} value={query} onChange={setQuery} />
          <PantryFilterRow theme={theme} value={filter} onChange={setFilter} />
          <ExpiringSoonSection theme={theme} items={expiringSoon} />

          <AllItemsSection
            theme={theme}
            items={filteredItems}
          />
        </ScrollView>
        <PantryItemSheet
          theme={theme}
        />
        <BottomNav theme={theme} />
      </View>
    </SafeAreaView>
  );
}
