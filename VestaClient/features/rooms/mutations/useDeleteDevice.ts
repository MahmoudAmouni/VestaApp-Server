import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../rooms.types";
import { apiDeleteDevice } from "../rooms.api";
import { roomsKey } from "../rooms.query";

export function useDeleteDevice(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation({
    mutationFn: ({ roomId, deviceId }: { roomId: number; deviceId: number }) =>
      apiDeleteDevice({ homeId, roomId, deviceId, token }),
    onMutate: async ({ roomId, deviceId }) => {
      await queryClient.cancelQueries({ queryKey: roomsKey(homeId) });
      const prev = queryClient.getQueryData<Room[]>(roomsKey(homeId));

      queryClient.setQueryData<Room[]>(roomsKey(homeId), (current) => {
        if (!current) return current;
        return current.map((room) => {
          if (room.id !== roomId) return room;
          return {
            ...room,
            devices: room.devices.filter((d) => d.id !== deviceId),
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
