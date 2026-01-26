import React, { useMemo, useState, useEffect } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

import { profileStyles as styles } from "./ProfileScreen.styles";
import SettingsSection, { SettingsItem } from "@/components/profile/SettingsSection/SettingsSection";
import HeaderSecondary from "@/components/ui/HeaderSecondary";
import ProfileSummaryCard from "@/components/profile/ProfileSummaryCard/ProfileSummaryCard";
import DangerZoneActions from "@/components/profile/DangerZoneActions/DangerZoneActions";
import ProfileSheet from "./ProfileSheet/ProfileSheet";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";
import InlineInputActionRow from "./InlineInputActionRow/InlineInputActionRow";
import ThemeToggle from "./ThemeToggle/ThemeToggle";


export default function ProfileScreen() {
  const { theme, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [homeName, setHomeName] = useState("My Home");
  const [showModal,setShowModal] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null);

  const { user, isLoading, logout, updateUser } = useAuth();
  
  useEffect(() => {
    if (user?.avatar_url) {
      setAvatar(user.avatar_url);
    }
  }, [user?.avatar_url]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        setAvatar(asset.uri);

        const base64 = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const mimeType = asset.mimeType ?? "image/jpeg";
        const avatarData = `data:${mimeType};base64,${base64}`;

        updateUser({ avatar: avatarData } as any); 
      }
    } catch (e) {
      Alert.alert("Error", "Failed to update profile picture");
    }
  };

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
    <View style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <HeaderSecondary
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
            name={user?.name || "User"}
            homeLabel="Home: My home"
            avatar={avatar}
            onPressEdit={() => {setShowModal(true)}}
            onPressAvatar={handlePickImage}
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
    </View>
  );
}
