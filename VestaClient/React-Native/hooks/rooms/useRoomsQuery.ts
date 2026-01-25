import { useQuery } from "@tanstack/react-query";
import type { Room } from "../../features/rooms/rooms.types";
import { apiGetRooms } from "../../features/rooms/rooms.api";

export const roomsKey = (homeId: number) => ["rooms", "home", homeId] as const;

export function useRoomsQuery(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useQuery<Room[], Error>({
    queryKey: roomsKey(homeId),
    queryFn: ({ signal }) => apiGetRooms({ homeId, token, signal }),
    staleTime: 30_000,
  });
}
