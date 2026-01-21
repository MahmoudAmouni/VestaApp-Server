import React, { useMemo, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";


import BottomNav from "@/components/ui/BottomNav";
import { profileStyles as styles } from "./ProfileScreen.styles";
import SettingsSection, { SettingsItem } from "@/components/profile/SettingsSection";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSummaryCard from "@/components/profile/ProfileSummaryCard";
import DangerZoneActions from "@/components/profile/DangerZoneActions";
import ProfileSheet from "./ProfileSheet";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";
import InlineInputActionRow from "../Settings/InlineInputActionRow";
import ThemeToggle from "../Settings/ThemeToggle";


export default function ProfileScreen() {
  const { theme, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [homeName, setHomeName] = useState("My Home");
  const [showModal,setShowModal] = useState(false)

  const {user,isLoading,logout} = useAuth()
  

  const support: SettingsItem[] = useMemo(
    () => [
      {
        title: "Privacy",
        sub: "Data, permissions, and controls",
        onPress: () => { router.push("/privacy"); },
      },
      {
        title: "About Vesta",
        sub: "Version, credits, and updates",
        onPress: () => { router.push("/about"); },
      },
    ],
    []
  );

  if (isLoading) return <Text>loading</Text>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <ProfileHeader
          theme={theme}
          title="Profile"
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 110 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ProfileSummaryCard
            theme={theme}
            name={user?.name}
            homeLabel="Home:My home"
            onPressEdit={() => {setShowModal(true)}}
          />

          <View style={{ marginBottom: 24 }}>
            <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>
              Home Settings
            </Text>
            <InlineInputActionRow
              theme={theme}
              value={homeName}
              onChangeText={setHomeName}
              placeholder="Home name..."
              actionLabel="Save"
              onPressAction={() => {}}
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>
              Theme
            </Text>
            <ThemeToggle theme={theme} value={mode} onChange={setMode} />
          </View>

          <SettingsSection theme={theme} title="Support" items={support} />

          <View style={styles.dangerWrap}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Danger zone
            </Text>
            <DangerZoneActions
              theme={theme}
              onSignOut={() => {logout()}}
              onDeleteAccount={() => {}}
            />
          </View>
        </ScrollView>
        <ProfileSheet visible={showModal} onClose={()=>setShowModal(false)}/>

      </View>
    </SafeAreaView>
  );
}
