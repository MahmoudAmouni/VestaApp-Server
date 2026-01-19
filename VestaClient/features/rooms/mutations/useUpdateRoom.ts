import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../rooms.types";
import { apiUpdateRoom } from "../rooms.api";
import type { RoomUpdatePatch } from "../rooms.write.types";
import { buildRoomUpdateDto } from "../rooms.write.types";
import { roomsKey } from "../rooms.query";
import { getRoomFromCache } from "../rooms.cache";

export function useUpdateRoom(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation({
    mutationFn: async (vars: { roomId: number; patch: RoomUpdatePatch }) => {
      const current = getRoomFromCache(homeId, vars.roomId);
      if (!current)
        throw new Error("Room not found in cache. Try refetching rooms.");

      const body = buildRoomUpdateDto(current, vars.patch);
      return apiUpdateRoom({ roomId: vars.roomId, homeId, body, token });
    },
    onMutate: async ({ roomId, patch }) => {
      await queryClient.cancelQueries({ queryKey: roomsKey(homeId) });
      const prev = queryClient.getQueryData<Room[]>(roomsKey(homeId));

      queryClient.setQueryData<Room[]>(roomsKey(homeId), (current) => {
        if (!current) return current;

        return current.map((r) => {
          if (r.id !== roomId) return r;
          return {
            ...r,
            room_name: patch.name
              ? { ...r.room_name, name: patch.name }
              : r.room_name,
          };
        });
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(roomsKey(homeId), ctx.prev);
    },
    onSuccess: (updatedRoom) => {
      queryClient.setQueryData<Room[]>(roomsKey(homeId), (current) => {
        if (!current) return current;
        return current.map((r) => (r.id === updatedRoom.id ? updatedRoom : r));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roomsKey(homeId) });
    },
  });
}
