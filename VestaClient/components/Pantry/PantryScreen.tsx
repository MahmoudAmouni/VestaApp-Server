import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import Header from "@/components/ui/Header";
import HeroCard from "@/components/ui/HeroCard";

import AllItemsSection from "@/components/Pantry/AllItemsSection/AllItemsSection";
import ExpiringSoonSection from "@/components/Pantry/ExpiringSoonSection/ExpiringSoonSection";
import PantryFilterRow, {
  PantryFilterKey,
} from "@/components/Pantry/PantryFilterRow/PantryFilterRow";
import PantrySearchBar from "@/components/Pantry/PantrySearchBar/PantrySearchBar";
import { usePantryQuery } from "@/hooks/pantry/usePantryQuery";
import { pantryScreenStyles as styles } from "./pantry.styles";
import PantryItemSheet from "./PantryItemSheet/PantryItemSheet";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { getExpiringSoon } from "@/utils/dateHelpers";

import Skeleton from "@/components/ui/Skeleton";


import ConfirmDeleteModal from "@/components/Room/ConfirmDeleteModal";
import { usePantryMutations } from "@/hooks/pantry/usePantryMutations";
import EmptyPantryState from "@/components/Pantry/EmptyPantryState/EmptyPantryState";
import { usePantryModal } from "@/contexts/PantryModalContext";

export default function PantryScreen() {
  const { theme } = useTheme();
  const { homeId, session } = useAuth();
  const token = session?.token;
  const { data: pantryItems = [], isLoading, error } = usePantryQuery({
    homeId,
    token,
  });
  const { deleteMutation } = usePantryMutations({ homeId, token });
  const { setShowModal } = usePantryModal();
  const insets = useSafeAreaInsets();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PantryFilterKey>(null);
  
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    let items = pantryItems;
    
    if (q.length > 0) {
      items = items.filter((it) => {
        const name = (it.item_name?.name ?? "").toLowerCase();
        return name.includes(q);
      });
    }

    if (filter !== null) {
      items = items.filter((it) => (it.location?.name ?? "") === filter);
    }

    return items;
  }, [pantryItems, query, filter]);

  const expiringSoon = getExpiringSoon(pantryItems);
  const locations = useMemo(() => {
    const locs = new Set<string>();
    pantryItems.forEach((item) => {
      if (item.location?.name) {
        locs.add(item.location.name);
      }
    });
    return Array.from(locs).sort();
  }, [pantryItems]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.screen, { backgroundColor: theme.bg }]}>
        <Header
          theme={theme}
          title="Pantry"
          kicker="Fresh Ingredients"
          icon="basket-outline"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 150 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <HeroCard
            theme={theme}
            title="Cook from what's inside."
            loading={isLoading}
            sub="Keep it simple: add items, check expiry, and let Vesta suggest meals."
            kpis={[
              { label: "Expiring soon", value: String(expiringSoon.length) },
              { label: "Pantry Items", value: String(pantryItems.length) },
            ]}
          />

          {(isLoading || pantryItems.length > 0) && (
            <>
              <PantrySearchBar theme={theme} value={query} onChange={setQuery} />
              <PantryFilterRow
                theme={theme}
                value={filter}
                onChange={setFilter}
                locations={locations}
              />

              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Expiring Soon
              </Text>
              {isLoading ? (
                <Skeleton height={100} borderRadius={12} />
              ) : (
                <ExpiringSoonSection items={expiringSoon} />
              )}
            </>
          )}

          {isLoading ? (
             <View style={{ gap: 14, marginTop: 16 }}>
                <Skeleton height={60} borderRadius={12} />
                <Skeleton height={60} borderRadius={12} />
                <Skeleton height={60} borderRadius={12} />
             </View>
          ) : (
            pantryItems.length === 0 ? (
              <EmptyPantryState
                theme={theme}
                onPressAction={() => setShowModal(true)}
              />
            ) : (
              <AllItemsSection
                theme={theme}
                items={filteredItems}
                onDelete={(id) => setDeleteId(id)}
              />
            )
          )}
        </ScrollView>
        <PantryItemSheet
          theme={theme}
        />
        <ConfirmDeleteModal
          visible={!!deleteId}
          theme={theme}
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
             if (deleteId) {
                deleteMutation.mutate({ pantryItemId: deleteId });
                setDeleteId(null);
             }
          }}
          message="Are you sure you want to delete this item from your pantry?"
        />
      </View>
    </SafeAreaView>
  );
}
