import { useInfiniteQuery } from "@tanstack/react-query";
import { apiGetChatPage } from "./aiChat.api";
import type { ChatPage } from "./aiChat.types";

export const aiChatKey = (homeId: number) =>
  ["aiChat", "home", homeId, "thread"] as const;

export function useAiChatQuery(args: {
  homeId: number;
  token?: string;
  enabled?: boolean;
}) {
  const { homeId, token, enabled = true } = args;

  return useInfiniteQuery<ChatPage, Error>({
    queryKey: aiChatKey(homeId),
    enabled: enabled && Boolean(homeId),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      apiGetChatPage({
        homeId,
        page: Number(pageParam),
        token,
        signal,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.lastPage
        ? lastPage.currentPage + 1
        : undefined,
    staleTime: 10_000,
  });
}
