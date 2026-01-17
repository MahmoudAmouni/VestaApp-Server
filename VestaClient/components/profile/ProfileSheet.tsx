import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { makeAuthSheetStyles } from "./AuthSheet.styles";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/auth/AuthContext";



type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileSheet({
  visible,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => makeAuthSheetStyles(theme, insets.bottom),
    [insets.bottom]
  );

  const {user,updateUser,homeId} = useAuth()


  const [fullName, setFullName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState("12345678");
  const [confirmPassword, setConfirmPassword] = useState("12345678");


  const translateY = useRef(new Animated.Value(720)).current;

  useEffect(() => {
    if (!visible) return;
    translateY.setValue(720);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  function handleClose() {
    onClose();
  }

  function handleSubmit() {
    updateUser({ name:fullName, email, password,passwordConfirmation:confirmPassword });
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>Edit Profile</Text>

            <Pressable style={styles.pillBtn} onPress={handleClose}>
              <Text style={styles.pillBtnText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder={"e.g. Jane Doe"}
              placeholderTextColor={theme.textMuted}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={"e.g. jane@company.com"}
              placeholderTextColor={theme.textMuted}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={"••••••••"}
              placeholderTextColor={theme.textMuted}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={"••••••••"}
              placeholderTextColor={theme.textMuted}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry
              returnKeyType="done"
            />
          </View>

          <View style={styles.actionsRow}>
            <Pressable style={styles.actionBtn} onPress={handleClose}>
              <Text style={styles.actionText}>Close</Text>
            </Pressable>

            <Pressable style={styles.actionBtnPrimary} onPress={handleSubmit}>
              <Text style={styles.actionTextPrimary}>Save</Text>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
