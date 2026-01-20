import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../../../features/rooms/rooms.types";
import { apiCreateDevice } from "../../../features/rooms/rooms.api";
import { roomsKey } from "../useRoomsQuery";

export function useCreateDevice(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation({
    mutationFn: async (vars: {
      roomId: number;
      dto: {
        device_name: string;
        external_id?: string | null;
        is_on?: boolean | null;
      };
    }) => {
      return apiCreateDevice({
        homeId,
        roomId: vars.roomId,
        body: vars.dto,
        token,
      });
    },
    onSuccess: (createdDevice, vars) => {
      queryClient.setQueryData<Room[]>(roomsKey(homeId), (current) => {
        if (!current) return current;

        return current.map((room) => {
          if (room.id !== vars.roomId) return room;
          const exists = room.devices.some((d) => d.id === createdDevice.id);
          if (exists) return room;
          return { ...room, devices: [createdDevice, ...room.devices] };
        });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roomsKey(homeId) });
    },
  });
}
