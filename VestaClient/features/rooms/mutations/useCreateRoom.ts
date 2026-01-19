import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../rooms.types";
import { apiCreateRoom } from "../rooms.api";
import { roomsKey } from "../rooms.query";

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
