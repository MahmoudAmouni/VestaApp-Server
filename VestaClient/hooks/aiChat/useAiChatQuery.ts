import { useInfiniteQuery } from "@tanstack/react-query";
import { apiGetChatPage } from "../../features/aiChat/aiChat.api";
import type { ChatPage } from "../../features/aiChat/aiChat.types";

export const aiChatKey = (homeId: number | undefined) =>
  ["aiChat", "home", homeId, "thread"] as const;

export function useAiChatQuery(args: {
  homeId: number | undefined;
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
        homeId: homeId!,
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
