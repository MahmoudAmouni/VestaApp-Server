import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BottomNav from "@/components/ui/BottomNav";
import AddItemRow from "@/components/ShoppingList/AddItemRow";
import ItemsSection from "@/components/ShoppingList/ItemsSection";
import ShoppingHeader from "@/components/ShoppingList/ShoppingHeader";
import ShoppingHero from "@/components/ShoppingList/ShoppingHero";
import { ShoppingListItem } from "@/features/shoppingList/shoppingList.types";
import { useShoppingListQuery } from "@/features/shoppingList/shoppingList.query";
import { useShoppingListMutations } from "@/features/shoppingList/shoppingList.mutations";
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

  if (isLoading) return <Text>is Loading...</Text>;

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
            { paddingBottom: 110 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ShoppingHero
            theme={theme}
            title="Grab the basics."
            subtitle="Tap to mark items as done. Add anything you need  Vesta can suggest based on your pantry."
            onPressPantryGaps={() => {}}
            onPressSavedRecipes={() => {}}
          />

          <AddItemRow
            onPress={() => {
              setOpenModal(true);
            }}
          />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Items
            </Text>

            <ItemsSection items={shoppingListItems} onToggle={onToggle} />
          </View>

          {/* <View style={styles.clearWrap}>
            <ItemsSection.ClearCheckedButton
              theme={theme}
              disabled={checkedCount === 0}
              onPress={clearChecked}
            />
          </View> */}
        </ScrollView>
        <ShoppingItemSheet
          visible={openModal}
          onClose={() => setOpenModal(false)}
          onSave={onCreate}
        />

        <BottomNav theme={theme} />
      </View>
    </SafeAreaView>
  );
}
