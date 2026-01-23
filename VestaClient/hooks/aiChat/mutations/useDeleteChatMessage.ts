import { useMutation, type InfiniteData } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { ChatPage } from "../../../features/aiChat/aiChat.types";
import { apiDeleteChatMessage } from "../../../features/aiChat/aiChat.api";
import { aiChatKey } from "../useAiChatQuery";

export function useDeleteChatMessage(args: {
  homeId: number | undefined;
  token?: string;
}) {
  const { homeId, token } = args;
  const key = homeId ? aiChatKey(homeId) : [];

  return useMutation<void, Error, { messageId: number }>({
    mutationFn: ({ messageId }) => {
      if (!homeId) throw new Error("No homeId");
      return apiDeleteChatMessage({ homeId, messageId, token });
    },

    onMutate: async ({ messageId }) => {
      if (!homeId) return;
      await queryClient.cancelQueries({ queryKey: key });

      queryClient.setQueryData<InfiniteData<ChatPage> | undefined>(
        key,
        (old) => {
          if (!old?.pages?.length) return old;

          const pages = old.pages.map((p) => ({
            ...p,
            messages: (p.messages ?? []).filter((m) => m.id !== messageId),
          }));

          return { ...old, pages };
        }
      );
    },

    onError: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
