import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/reactQuery";
import type { Room, Device } from "./rooms.types";
import {
  apiCreateRoom,
  apiDeleteRoom,
  apiUpdateRoom,
  apiCreateDevice,
  apiDeleteDevice,
  apiUpdateDevice,
} from "./rooms.api";
import type { RoomUpdatePatch, DeviceUpdatePatch } from "./rooms.write.types";
import { buildRoomUpdateDto, buildDeviceUpdateDto } from "./rooms.write.types";
import { roomsKey } from "./rooms.query";
import { getRoomFromCache, getDeviceFromCache } from "./rooms.cache";

export function useRoomsMutations(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;


  const createRoomMutation = useMutation({
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

  const updateRoomMutation = useMutation({
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

  const deleteRoomMutation = useMutation({
    mutationFn: ({ roomId }: { roomId: number }) =>
      apiDeleteRoom({ homeId, roomId, token }),
    onMutate: async ({ roomId }) => {
      await queryClient.cancelQueries({ queryKey: roomsKey(homeId) });
      const prev = queryClient.getQueryData<Room[]>(roomsKey(homeId));

      queryClient.setQueryData<Room[]>(roomsKey(homeId), (current) => {
        if (!current) return current;
        return current.filter((r) => r.id !== roomId);
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

  const updateDeviceMutation = useMutation({
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

  return {
    createRoomMutation,
    updateRoomMutation,
    deleteRoomMutation,
    createDeviceMutation,
    updateDeviceMutation,
    deleteDeviceMutation,
  };
}
