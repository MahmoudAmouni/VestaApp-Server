import { useAiChatQuery } from "./aiChat.query";
import { useAiChatMutations } from "./aiChat.mutations";

export function useAiChat(args: {
  homeId: number;
  token?: string;
  enabled?: boolean;
}) {
  const { homeId, token, enabled = true } = args;

  const query = useAiChatQuery({ homeId, token, enabled });
  const { sendMutation, deleteMutation, isSending } = useAiChatMutations({
    homeId,
    token,
  });

  const messages = query.data?.pages.flatMap((p) => p.messages) ?? [];

  return {
    messages,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ?? null,

    hasOlder: Boolean(query.hasNextPage),
    isFetchingOlder: query.isFetchingNextPage,
    fetchOlder: query.fetchNextPage,

    isSending,
    sendMessage: (message: string) => sendMutation.mutate({ message }),

    deleteMessage: (messageId: number) => deleteMutation.mutate({ messageId }),

    refetch: query.refetch,
  };
}
