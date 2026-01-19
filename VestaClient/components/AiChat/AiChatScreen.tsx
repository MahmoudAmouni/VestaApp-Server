import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";

import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import { aiChatStyles as styles } from "./ai.styles";
import ChatThread from "@/components/AiChat/ChatThread";
import ChatComposer from "@/components/AiChat/ChatComposer";
import { useAiChatQuery } from "@/hooks/aiChat/useAiChatQuery";
import { useAiChatMutations } from "@/hooks/aiChat/useAiChatMutations";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";

export default function AiChatScreen() {
  const { theme } = useTheme();

  const {homeId} = useAuth();

  const {
    data,
    isLoading,
    isFetchingNextPage: isFetchingOlder,
    hasNextPage: hasOlder,
    fetchNextPage: fetchOlder,
  } = useAiChatQuery({ homeId });
  const { sendMutation, isSending } = useAiChatMutations({ homeId });

  const messages = data?.pages.flatMap((p) => p.messages) ?? [];
  const sendMessage = (msg: string) => sendMutation.mutate({ message: msg });

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
