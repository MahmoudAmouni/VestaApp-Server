import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../rooms.types";
import { apiUpdateDevice } from "../rooms.api";
import type { DeviceUpdatePatch } from "../rooms.write.types";
import { buildDeviceUpdateDto } from "../rooms.write.types";
import { roomsKey } from "../rooms.query";
import { getDeviceFromCache } from "../rooms.cache";

export function useUpdateDevice(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation({
    mutationFn: async (vars: {
      roomId: number;
      deviceId: number;
      patch: DeviceUpdatePatch;
    }) => {
      const current = getDeviceFromCache(homeId, vars.deviceId);
      if (!current)
        throw new Error("Device not found in cache. Try refetching rooms.");

      const body = buildDeviceUpdateDto(current, vars.patch);
      return apiUpdateDevice({
        deviceId: vars.deviceId,
        homeId,
        roomId: vars.roomId,
        body,
        token,
      });
    },
    onMutate: async ({ deviceId, patch }) => {
      await queryClient.cancelQueries({ queryKey: roomsKey(homeId) });
      const prev = queryClient.getQueryData<Room[]>(roomsKey(homeId));

      queryClient.setQueryData<Room[]>(roomsKey(homeId), (current) => {
        if (!current) return current;

        return current.map((room) => ({
          ...room,
          devices: room.devices.map((d) => {
            if (d.id !== deviceId) return d;
            return {
              ...d,
              external_id: patch.external_id ?? d.external_id,
              is_on: patch.is_on ?? d.is_on,
              device_name: patch.name
                ? { ...d.device_name, name: patch.name }
                : d.device_name,
            };
          }),
        }));
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(roomsKey(homeId), ctx.prev);
    },
    onSuccess: (updatedDevice) => {
      queryClient.setQueryData<Room[]>(roomsKey(homeId), (current) => {
        if (!current) return current;
        return current.map((room) => ({
          ...room,
          devices: room.devices.map((d) =>
            d.id === updatedDevice.id ? updatedDevice : d
          ),
        }));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roomsKey(homeId) });
    },
  });
}
