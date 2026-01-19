import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../../../features/rooms/rooms.types";
import { apiCreateRoom } from "../../../features/rooms/rooms.api";
import { roomsKey } from "../useRoomsQuery";

export function useCreateRoom(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation({
    mutationFn: async (vars: { dto: { room_name: string } }) => {
      return apiCreateRoom({ homeId, body: vars.dto, token });
    },
    onSuccess: (createdRoom) => {
      queryClient.setQueryData<Room[]>(roomsKey(homeId), (current) => {
        const cur = current ?? [];
        if (cur.some((r) => r.id === createdRoom.id)) return cur;
        return [createdRoom, ...cur];
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roomsKey(homeId) });
    },
  });
}
