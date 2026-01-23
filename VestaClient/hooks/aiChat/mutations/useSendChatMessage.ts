import { useMutation, type InfiniteData } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { ChatMessage, ChatPage } from "../../../features/aiChat/aiChat.types";
import { apiSendChatMessage } from "../../../features/aiChat/aiChat.api";
import { aiChatKey } from "../useAiChatQuery";

function sortNewestFirst(a: ChatMessage, b: ChatMessage) {
  const ta = Date.parse(a.created_at || "") || 0;
  const tb = Date.parse(b.created_at || "") || 0;
  if (tb !== ta) return tb - ta;
  return b.id - a.id;
}

function mergeDedupeNewestFirst(base: ChatMessage[], incoming: ChatMessage[]) {
  const byId = new Map<number, ChatMessage>();
  for (const m of base) byId.set(m.id, m);
  for (const m of incoming) byId.set(m.id, m);
  return Array.from(byId.values()).sort(sortNewestFirst);
}

export function useSendChatMessage(args: {
  homeId: number | undefined;
  token?: string;
}) {
  const { homeId, token } = args;
  const key = homeId ? aiChatKey(homeId) : [];

  return useMutation<
    ChatMessage[],
    Error,
    { message: string },
    { tempUserId: number; tempTypingId: number }
  >({
    mutationFn: ({ message }) => {
      if (!homeId) throw new Error("No homeId");
      return apiSendChatMessage({ homeId, message, token });
    },

    onMutate: async ({ message }) => {
      if (!homeId) return { tempUserId: 0, tempTypingId: 0 };
      await queryClient.cancelQueries({ queryKey: key });

      const tempUserId = Date.now() * -1;
      const tempTypingId = tempUserId - 1;
      const now = new Date().toISOString();

      const optimisticUser: ChatMessage = {
        id: tempUserId,
        role: "user",
        content: message,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      };

      const typing: ChatMessage = {
        id: tempTypingId,
        role: "assistant",
        content: "…",
        created_at: now,
        updated_at: now,
        deleted_at: null,
      };

      queryClient.setQueryData<InfiniteData<ChatPage> | undefined>(
        key,
        (old) => {
          if (!old?.pages?.length) {
            return {
              pageParams: [1],
              pages: [
                {
                  currentPage: 1,
                  lastPage: 1,
                  messages: [typing, optimisticUser],
                },
              ],
            };
          }

          const pages = [...old.pages];
          const first = pages[0];

          pages[0] = {
            ...first,
            messages: [typing, optimisticUser, ...(first.messages ?? [])],
          };

          return { ...old, pages };
        }
      );

      return { tempUserId, tempTypingId };
    },

    onSuccess: (serverMessages, _vars, ctx) => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.setQueryData<InfiniteData<ChatPage> | undefined>(
        key,
        (old) => {
          if (!old?.pages?.length) return old;

          const pages = [...old.pages];
          const first = pages[0];

          let next = (first.messages ?? []).filter(
            (m) => m.id !== ctx?.tempTypingId
          );

          const serverHasUser = serverMessages.some((m) => m.role === "user");
          if (serverHasUser)
            next = next.filter((m) => m.id !== ctx?.tempUserId);

          pages[0] = {
            ...first,
            messages: mergeDedupeNewestFirst(next, serverMessages),
          };

          return { ...old, pages };
        }
      );
    },

    onError: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
