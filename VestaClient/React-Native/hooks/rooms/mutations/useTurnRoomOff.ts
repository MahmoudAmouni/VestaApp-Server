import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../../../features/rooms/rooms.types";
import { apiTurnRoomOff } from "../../../features/rooms/rooms.api";
import { roomsKey } from "../useRoomsQuery";

export function useTurnRoomOff(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation({
    mutationFn: async (vars: { roomId: number }) => {
      return apiTurnRoomOff({ roomId: vars.roomId, homeId, token });
    },
    onMutate: async ({ roomId }) => {
      await queryClient.cancelQueries({ queryKey: roomsKey(homeId) });
      const prev = queryClient.getQueryData<Room[]>(roomsKey(homeId));

      queryClient.setQueryData<Room[]>(roomsKey(homeId), (current) => {
        if (!current) return current;
        return current.map((r) => {
          if (r.id !== roomId) return r;
          return {
            ...r,
            devices: r.devices ? r.devices.map(d => ({ ...d, is_on: false })) : []
          };
        });
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(roomsKey(homeId), ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roomsKey(homeId) });
    },
  });
}
