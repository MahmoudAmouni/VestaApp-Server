import type { ApiResponse } from "@/features/rooms/rooms.types";

export type ChatRole = "user" | "assistant" | "system" | string;

export type ChatMessage = {
  id: number;
  role: ChatRole;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ChatMessageRaw = ChatMessage;

export type ChatMessagesPaginatorRaw = {
  current_page: number;
  data: ChatMessageRaw[];
  last_page: number;

  next_page_url?: string | null;
  prev_page_url?: string | null;

  total?: number;
  per_page?: number;
};

export type ChatMessagesListResponseRaw = ApiResponse<{
  chat_messages: ChatMessagesPaginatorRaw;
}>;

export type ChatPage = {
  currentPage: number;
  lastPage: number;
  messages: ChatMessage[]; 
};

export function mapChatMessage(raw: ChatMessageRaw): ChatMessage {
  if (!raw?.id) throw new Error("Chat message missing id.");
  if (!raw?.role) throw new Error("Chat message missing role.");
  if (raw?.content === undefined || raw?.content === null)
    throw new Error("Chat message missing content.");

  return {
    id: raw.id,
    role: raw.role,
    content: String(raw.content),
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    deleted_at: raw.deleted_at ?? null,
  };
}
