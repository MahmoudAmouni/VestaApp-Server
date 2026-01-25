import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../../../features/rooms/rooms.types";
import { apiDeleteDevice } from "../../../features/rooms/rooms.api";
import { roomsKey } from "../useRoomsQuery";

import Toast from "react-native-toast-message";

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
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Device Deleted",
        text2: "The device has been removed from the room.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roomsKey(homeId) });
    },
  });
}
