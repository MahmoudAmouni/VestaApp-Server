import Header from "@/React-Native/components/ui/Header";
import HeroCard from "@/React-Native/components/ui/HeroCard";
import RoomCard from "@/React-Native/components/Home/RoomCard/RoomCard";
import EmptyRoomState from "@/React-Native/components/Rooms/EmptyRoomState";

import SectionHeader from "@/React-Native/components/Home/SectionHeader/SectionHeader";

import { useRoomsQuery } from "@/React-Native/hooks/rooms/useRoomsQuery";
import { usePantryQuery } from "@/React-Native/hooks/pantry/usePantryQuery";
import { getExpiringSoon } from "@/React-Native/utils/dateHelpers";
import { useRouter } from "expo-router";
import ShoppingListPreview from "@/React-Native/components/Home/ShoppingListPreview/ShoppingListPreview";
import { useShoppingListQuery } from "@/React-Native/hooks/shoppingList/useShoppingListQuery";
import { useSavedRecipesQuery } from "@/React-Native/hooks/savedRecipes/useSavedRecipesQuery";
import RoomSheet from "@/React-Native/components/Rooms/RoomSheet";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import ExpiringSoonSection from "../Pantry/ExpiringSoonSection/ExpiringSoonSection";
import { indexStyles as styles } from "./Dashboard.styles";
import { useAuth } from "@/React-Native/contexts/auth/AuthContext";
import { useTheme } from "@/React-Native/contexts/theme/ThemeContext";
import Skeleton from "../ui/Skeleton";

type NavKey = "Home" | "Rooms" | "Pantry" | "Recipes" | "AI";

export default function DashboardScreen() {
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<NavKey>("Home");
  const [showRoomSheet, setShowRoomSheet] = useState(false);
  const { session } = useAuth();
  const homeId = session?.homeId ?? 0;
  const token = session?.token;

  const { data: pantryItems = [], isLoading } = usePantryQuery({ homeId, token });
  const { data: rooms = [], isLoading: isGettingRooms } = useRoomsQuery({ homeId, token });
  const { data: shoppingList = [], isLoading: isGettingList } = useShoppingListQuery({ homeId, token });
  const { data: savedRecipes = [], isLoading: isGettingRecipes } = useSavedRecipesQuery({ homeId, token });
  
  const isWorking = isLoading || isGettingRooms || isGettingList || isGettingRecipes;
  const expiringSoon = getExpiringSoon(pantryItems);
  
  const devicesOn = rooms.reduce((acc, room) => acc + (room.devices?.filter(d => d.is_on).length || 0), 0);
  const totalDevices = rooms.reduce((acc, room) => acc + (room.devices?.length || 0), 0);
  const devicesOff = totalDevices - devicesOn;
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.phone, { backgroundColor: theme.surface }]}>
        <Header
          theme={theme}
          kicker="Welcome Home"
          title="Dashboard"
          icon="grid-outline"
          onPressNotifications={() => {}}
        />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}
          showsVerticalScrollIndicator={false}
        >
          <HeroCard
            theme={theme}
            title="Calm & ready."
            sub="A quick snapshot of your space lights, pantry, and what’s coming up."
            loading={isWorking}
            kpis={[
              { label: "Devices ON", value: String(devicesOn) },
              { label: "Offline", value: String(devicesOff) },
              { label: "Expiring soon", value: String(expiringSoon.length) },
              { label: "Saved Recipes", value: String(savedRecipes.length) },
            ]}
          />

          <SectionHeader
            theme={theme}
            title="Rooms"
            actionLabel="Manage"
            onPressAction={() => router.replace("/rooms")}
          />

          <View style={styles.sectionGap}>
            {isWorking ? (
               <View style={{ gap: 14 }}>
                  <Skeleton height={140} borderRadius={18} />
                  <Skeleton height={140} borderRadius={18} />
               </View>
            ) : (
              rooms.length === 0 ? (
                <EmptyRoomState 
                  theme={theme} 
                  onAddRoom={() => setShowRoomSheet(true)} 
                />
              ) : (
                rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                  />
                ))
              )
            )}
          </View>

          <View style={styles.sectionGap}>
            <SectionHeader
              theme={theme}
              title="Shopping List"
              actionLabel="View All"
              onPressAction={() => router.push("/shoppingList")}
            />
            {isWorking ? (
              <Skeleton height={120} borderRadius={16} />
            ) : (
              <ShoppingListPreview
                theme={theme}
                items={shoppingList}
                onPressAction={() => router.push("/shoppingList")}
              />
            )}
          </View>

          <View style={{ height: 24 }} />

            <>
              <SectionHeader
                theme={theme}
                title="Expiring Soon"
                actionLabel="Open Pantry"
                onPressAction={() => router.replace("/pantry")}
              />

                {isWorking ? (
                  <Skeleton height={100} borderRadius={12} />
                ) : (
                  <ExpiringSoonSection items={expiringSoon} />
                )}
            </>
          <View style={{ height: 14 }} />
          


          <View style={{ height: 18 }} />
        </ScrollView>
        <RoomSheet
          visible={showRoomSheet}
          onClose={() => setShowRoomSheet(false)}
        />
      </View>
    </SafeAreaView>
  );
}
