import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";

const BG_IMAGE = require("@/assets/images/image.png");

import Header from "@/components/ui/Header";
import { aiChatStyles as styles } from "./ai.styles";
import ChatThread from "@/components/AiChat/ChatThread/ChatThread";
import ChatComposer from "@/components/AiChat/ChatComposer/ChatComposer";
import { useAiChatQuery } from "@/hooks/aiChat/useAiChatQuery";
import { useAiChatMutations } from "@/hooks/aiChat/useAiChatMutations";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { router } from "expo-router";

export default function AiChatScreen(props: { recipeData?: string }) {
  const { recipeData } = props;
  const { theme } = useTheme();

  const { homeId, session } = useAuth();
  const token = session?.token;

  const {
    data,
    isLoading,
    isFetchingNextPage: isFetchingOlder,
    hasNextPage: hasOlder,
    fetchNextPage: fetchOlder,
  } = useAiChatQuery({ homeId: homeId ?? undefined, token });
  const { sendMutation, isSending } = useAiChatMutations({ homeId: homeId ?? undefined, token });

  const messages = data?.pages.flatMap((p) => p.messages) ?? [];
  const sendMessage = (msg: string) => sendMutation.mutate({ message: msg });

  const [text, setText] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (recipeData) {
      try {
        const recipe = JSON.parse(recipeData);
        const prompt = [
          `[RECIPE_CONTEXT] The user is inquiring about this recipe: "${recipe.recipe_name}".`,
          `Description: ${recipe.description || "N/A"}`,
          `Ingredients: ${recipe.ingredients}`,
          `Directions: ${recipe.directions}`,
          "",
          'Respond ONLY with: "I can help you with the following recipe, ask me whatever you want!" and remember this recipe for future questions in this session.'
        ].join("\n");

        sendMessage(prompt);
        router.setParams({ recipeData: undefined });
      } catch (e) {
        console.error("Error parsing recipeData in AiChatScreen", e);
      }
    }
  }, [recipeData]);


  const onSend = useCallback(() => {
    const msg = text.trim();
    if (!msg) return;

    sendMessage(msg);
    setText("");

  }, [text, sendMessage]);

  return (
    <ImageBackground
      source={BG_IMAGE}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <SafeAreaView style={[styles.safe, { backgroundColor: "transparent" }]}>
        <View style={styles.screen}>
          <StatusBar barStyle="light-content" />
          <Header
            theme={theme}
            title="Assistant"
            kicker="Always Ready"
            icon="sparkles-outline"
          />

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
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
