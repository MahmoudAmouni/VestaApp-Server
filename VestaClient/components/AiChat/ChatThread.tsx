import React, { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";

import { useTheme } from "@/contexts/theme/ThemeContext";
import type { ChatMessage } from "@/features/aiChat/aiChat.types";
import ChatMessageBubble from "./ChatMessageBubble";
import { chatThreadStyles as styles } from "./ChatThread.styles";

type Props = {
  messages: ChatMessage[];

  isInitialLoading: boolean;

  hasOlder: boolean;
  isFetchingOlder: boolean;
  onLoadOlder: () => void;

  onAtBottomChange?: (atBottom: boolean) => void;
};

export default function ChatThread({
    messages,
    hasOlder,
    isFetchingOlder,
    isInitialLoading,
    onAtBottomChange,
    onLoadOlder
  }: Props) {
  const { theme } = useTheme();

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const endReachedLock = useRef(false);

  const keyExtractor = useCallback((m: ChatMessage) => String(m.id), []);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      onAtBottomChange?.(y < 40);
    },
    [onAtBottomChange]
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <ChatMessageBubble theme={theme} message={item} />
    ),
    []
  );

 

  const ListFooter = useMemo(() => {
    if (!isFetchingOlder) return <View style={{ height: 10 }} />;

    return (
      <View style={{ paddingVertical: 10, alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }, [isFetchingOlder]);

  if (isInitialLoading) {
    return (
      <View
        style={[
          styles.scroll,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      style={styles.scroll}
      data={messages}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      inverted
      contentContainerStyle={{ paddingTop: 0, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onScroll={onScroll}
      scrollEventThrottle={16}
      removeClippedSubviews
      initialNumToRender={16}
      maxToRenderPerBatch={16}
      windowSize={10}
      ListFooterComponent={ListFooter}
      onEndReached={() => {
        if (endReachedLock.current) return;
        if (!hasOlder || isFetchingOlder) return;

        endReachedLock.current = true;
        onLoadOlder();

        setTimeout(() => {
          endReachedLock.current = false;
        }, 400);
      }}
      onEndReachedThreshold={0.2}
    />
  );
}
