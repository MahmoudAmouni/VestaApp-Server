import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { aiChatStyles as styles } from "./ai.styles";
import ChatThread from "@/components/AiChat/ChatThread";
import ChatComposer from "@/components/AiChat/ChatComposer";
import { useAiChat } from "@/features/aiChat/useAiChat";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/auth/AuthContext";

export default function AiChatScreen() {

  const {homeId} = useAuth();

  const {
    messages,
    isLoading,
    isFetchingOlder,
    hasOlder,
    fetchOlder,
    isSending,
    sendMessage,
  } = useAiChat({ homeId });

  const [text, setText] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);


  const onSend = useCallback(() => {
    const msg = text.trim();
    if (!msg) return;

    sendMessage(msg);
    setText("");

  }, [text, sendMessage]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <Header theme={theme} title="Vesta" kicker="AI" />

        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={0}
        >
          <ChatThread
            messages={messages} 
            isInitialLoading={isLoading}
            isFetchingOlder={isFetchingOlder}
            hasOlder={hasOlder}
            onLoadOlder={fetchOlder}
            onAtBottomChange={setIsAtBottom}
          />

          <ChatComposer
            theme={theme}
            value={text}
            onChangeText={setText}
            onSend={onSend}
            disabled={isSending} 
          />
        </KeyboardAvoidingView>

        <BottomNav theme={theme} />
      </View>
    </SafeAreaView>
  );
}
