import { fetchJson } from "@/api/http";
import type { ApiResponse } from "@/features/rooms/rooms.types";
import type {
  ChatMessage,
  ChatMessageRaw,
  ChatMessagesListResponseRaw,
  ChatPage,
} from "./aiChat.types";
import { mapChatMessage } from "./aiChat.types";

export async function apiGetChatPage(params: {
  homeId: number;
  page: number;
  token?: string;
  signal?: AbortSignal;
}): Promise<ChatPage> {
  const { homeId, page, token, signal } = params;

  const res = await fetchJson<ChatMessagesListResponseRaw>(
    `/chat/${homeId}?page=${page}`,
    { method: "GET", token, signal }
  );

  if (!res.success)
    throw new Error(res.message || "Chat messages failed to load.");

  const paginator = res.data?.chat_messages;
  const raw = Array.isArray(paginator?.data) ? paginator!.data : [];

  return {
    currentPage: paginator?.current_page ?? page,
    lastPage: paginator?.last_page ?? page,
    messages: raw.map(mapChatMessage), 
  };
}

type SendResponseRaw = ApiResponse<{
  chat_messages?: ChatMessageRaw[];
  chat_message?: ChatMessageRaw;
  user_message?: ChatMessageRaw;
  assistant_message?: ChatMessageRaw;
}>;

function pickSendMessages(res: SendResponseRaw): ChatMessage[] {
  const d = res.data ?? {};
  const merged: ChatMessageRaw[] = [];

  if (Array.isArray(d.chat_messages)) merged.push(...d.chat_messages);
  if (d.chat_message) merged.push(d.chat_message);
  if (d.user_message) merged.push(d.user_message);
  if (d.assistant_message) merged.push(d.assistant_message);

  const byId = new Map<number, ChatMessage>();
  for (const r of merged) byId.set(r.id, mapChatMessage(r));
  return Array.from(byId.values());
}

export async function apiSendChatMessage(params: {
  homeId: number;
  message: string;
  token?: string;
  signal?: AbortSignal;
}): Promise<ChatMessage[]> {
  const { homeId, message, token, signal } = params;

  const res = await fetchJson<SendResponseRaw>(
    `/messages/${homeId}`,
    {
      method: "POST",
      token,
      signal,
      body: { message }, 
    }
  );

  if (!res.success) throw new Error(res.message || "Failed to send message.");
  return pickSendMessages(res);
}


export async function apiDeleteChatMessage(params: {
  homeId: number;
  messageId: number;
  token?: string;
  signal?: AbortSignal;
}): Promise<void> {
  const { homeId,  messageId, token, signal } = params;

  const res = await fetchJson<ApiResponse<unknown>>(
    `/messages/${homeId}/${messageId}`,
    { method: "GET", token, signal }
  );

  if (!res.success) throw new Error(res.message || "Failed to delete message.");
}
