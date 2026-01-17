import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room, Device } from "../../../features/rooms/rooms.types";
import {
  apiCreateDevice,
  apiDeleteDevice,
  apiUpdateDevice,
} from "../../../features/rooms/rooms.api";
import type { DeviceUpdatePatch } from "../../../features/rooms/rooms.write.types";
import { buildDeviceUpdateDto } from "../../../features/rooms/rooms.write.types";
import { roomsKey } from "../rooms.query";
import { getDeviceFromCache } from "../rooms.cache";

export function useDeviceMutations(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  const updateDeviceMutation = useMutation({
    mutationFn: async (vars: {
      homeId: number;
      roomId: number;
      deviceId: number;
      patch: DeviceUpdatePatch;
    }) => {
      const current = getDeviceFromCache(vars.homeId, vars.deviceId);
      if (!current)
        throw new Error("Device not found in cache. Try refetching rooms.");

      const body = buildDeviceUpdateDto(current, vars.patch);
      return apiUpdateDevice({
        deviceId: vars.deviceId,
        homeId: vars.homeId,
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

            const next: Device = {
              ...d,
              external_id: patch.external_id ?? d.external_id,
              is_on: patch.is_on ?? d.is_on,
              device_name: patch.name
                ? { ...d.device_name, name: patch.name }
                : d.device_name,
            };
            return next;
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

  const createDeviceMutation = useMutation({
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

  const deleteDeviceMutation = useMutation({
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

  const updateDevice = useCallback(
    (deviceId: number, roomId: number, patch: DeviceUpdatePatch) => {
      updateDeviceMutation.mutate({ homeId, roomId, deviceId, patch });
    },
    [updateDeviceMutation, homeId]
  );

  const toggleDevice = useCallback(
    (deviceId: number, roomId: number) => {
      const current = getDeviceFromCache(homeId, deviceId);
      if (!current) return;

      updateDeviceMutation.mutate({
        homeId,
        roomId,
        deviceId,
        patch: { is_on: !current.is_on },
      });
    },
    [homeId, updateDeviceMutation]
  );

  const createDevice = useCallback(
    (
      roomId: number,
      dto: {
        device_name: string;
        external_id?: string | null;
        is_on?: boolean | null;
      }
    ) => {
      createDeviceMutation.mutate({ roomId, dto });
    },
    [createDeviceMutation]
  );

  const deleteDevice = useCallback(
    (deviceId: number, roomId: number) => {
      const current = getDeviceFromCache(homeId, deviceId);
      if (!current) return;
      deleteDeviceMutation.mutate({ deviceId, roomId });
    },
    [deleteDeviceMutation, homeId]
  );

  return { updateDevice, toggleDevice, createDevice,deleteDevice };
}

