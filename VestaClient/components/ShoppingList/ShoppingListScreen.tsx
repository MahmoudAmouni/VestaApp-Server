import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AddItemRow from "@/components/ShoppingList/AddItemRow";
import ItemsSection from "@/components/ShoppingList/ItemsSection";
import ShoppingHeader from "@/components/ShoppingList/ShoppingHeader";

import HeroCard from "@/components/ui/HeroCard";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { ShoppingListItem } from "@/features/shoppingList/shoppingList.types";
import { useShoppingListQuery } from "@/hooks/shoppingList/useShoppingListQuery";
import { useShoppingListMutations } from "@/hooks/shoppingList/useShoppingListMutations";
import { shoppingStyles as styles } from "./ShoppingListScreen.styles";
import ShoppingItemSheet from "./shoppingListSheet";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";

export default function ShoppingListScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {homeId,session} = useAuth()
  const token = session?.token;
  const { data: shoppingListItems = [], isLoading } = useShoppingListQuery({ homeId, token });
  const { updateMutation, createMutation } = useShoppingListMutations({ homeId, token }); 

  function onToggle(id: number, item: ShoppingListItem) {
    updateMutation.mutate({
      shoppingListItemId: id,
      patch: {
        is_checked: !item.is_checked,
        item_name: item.item_name.name,
        quantity: item.quantity,
        unit: item.unit.name,
      }
    });
  }
  function onCreate({
    name,
    unit,
    quantity,
  }: {
    name: string;
    unit: string;
    quantity: string;
  }) {
    createMutation.mutate({
      dto: {
        item_name: name,
        unit: unit,
        quantity: Number(quantity),
        is_checked: false,
      }
    });
  }
  const [openModal, setOpenModal] = useState(false);


  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <ShoppingHeader
          theme={theme}
          title="Shopping list"
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 150 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <HeroCard
            theme={theme}
            title="Grab the basics."
            sub="Tap to mark items as done. Add anything you need Vesta can suggest based on your pantry."
            loading={isLoading}
            kpis={[
              { label: "Total Items", value: String(shoppingListItems.length) },
              { label: "Checked", value: String(shoppingListItems.filter(i => i.is_checked).length) },
            ]}
          >
             <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <Button
                  variant="secondary"
                  label="From pantry gaps"
                  onPress={() => {}}
                  style={{flex: 1}}
                />
                <Button
                  variant="secondary"
                  label="For saved recipes"
                  onPress={() => {}}
                  style={{flex: 1}}
                />
             </View>
          </HeroCard>

          <View style={styles.section}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Items
              </Text>
              <Button
                variant="secondary"
                label="Add"
                icon="add"
                onPress={() => setOpenModal(true)}
                style={{
                  height: 32,
                  paddingHorizontal: 12,
                  paddingVertical: 0,
                  borderRadius: 8,
                }}
                textStyle={{ fontSize: 13, fontWeight: "700" }}
              />
            </View>

            {isLoading ? (
               <View style={{ gap: 10 }}>
                  <Skeleton height={50} borderRadius={12} />
                  <Skeleton height={50} borderRadius={12} />
                  <Skeleton height={50} borderRadius={12} />
               </View>
            ) : (
               <ItemsSection items={shoppingListItems} onToggle={onToggle} />
            )}
            <Button
              variant="secondary"
              label="Clear all checks"
              onPress={() => {}}
              style={{ marginTop: 12 }}
            />
          </View>
        </ScrollView>
        <ShoppingItemSheet
          visible={openModal}
          onClose={() => setOpenModal(false)}
          onSave={onCreate}
        />
      </View>
    </SafeAreaView>
  );
}
