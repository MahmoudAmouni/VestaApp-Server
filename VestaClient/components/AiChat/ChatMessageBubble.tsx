import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import type { Theme } from "@/type";
import { chatMessageBubbleStyles as styles } from "./ChatMessageBubble.styles";
import type { ChatMessage } from "@/features/aiChat/aiChat.types";

export default function ChatMessageBubble(props: {
  theme: Theme;
  message: ChatMessage;
}) {
  const { theme, message } = props;

  const isUser = message.role === "user";
  const isTyping = message.role === "assistant" && message.content === "…";

  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.userBubble : styles.assistantBubble,
    {
      backgroundColor: isUser ? theme.primary : theme.surface,
      borderColor: isUser ? "transparent" : theme.border,
    },
  ];

  const nameColor = isUser ? "#FFFFFF" : theme.textMuted;
  const textColor = isUser ? "#FFFFFF" : theme.text;

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <View style={bubbleStyle}>
        <Text style={[styles.name, { color: nameColor }]}>
          {isUser ? "You" : "Vesta"}
        </Text>

        {isTyping ? (
          <View style={{ paddingTop: 6 }}>
            <ActivityIndicator size="small" color={textColor} />
          </View>
        ) : (
          <Text style={[styles.text, { color: textColor }]}>
            {message.content}
          </Text>
        )}
      </View>
    </View>
  );
}
