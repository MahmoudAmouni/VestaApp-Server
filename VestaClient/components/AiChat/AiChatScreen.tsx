import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";

const BG_IMAGE = require("@/assets/images/chat_bg.png");

import Header from "@/components/ui/Header";
import { aiChatStyles as styles } from "./ai.styles";
import ChatThread from "@/components/AiChat/ChatThread";
import ChatComposer from "@/components/AiChat/ChatComposer";
import { useAiChatQuery } from "@/hooks/aiChat/useAiChatQuery";
import { useAiChatMutations } from "@/hooks/aiChat/useAiChatMutations";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";

export default function AiChatScreen() {
  const { theme } = useTheme();

  const { homeId, session } = useAuth();
  const token = session?.token;

  const {
    data,
    isLoading,
    isFetchingNextPage: isFetchingOlder,
    hasNextPage: hasOlder,
    fetchNextPage: fetchOlder,
  } = useAiChatQuery({ homeId, token });
  const { sendMutation, isSending } = useAiChatMutations({ homeId, token });

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
        <Header
          theme={theme}
          title="Assistant"
          kicker="Always Ready"
          icon="sparkles-outline"
        />

        <ImageBackground
          source={BG_IMAGE}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
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
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}
