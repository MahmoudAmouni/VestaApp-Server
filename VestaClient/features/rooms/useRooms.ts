import { useMemo } from "react";
import { useRoomsQuery } from "./rooms.query";
import { useRoomsMutations } from "./rooms.mutations";
import type { Room, Device } from "./rooms.types";
import type { RoomUpdatePatch, DeviceUpdatePatch } from "./rooms.write.types";

export type UseRoomsResult = {
  rooms: Room[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;

  getRoomById: (roomId: number) => Room | undefined;
  getDeviceById: (deviceId: number) => Device | undefined;

  createRoom: (dto: { room_name: string }) => void;
  updateRoom: (roomId: number, patch: RoomUpdatePatch) => void;
  deleteRoom: (roomId: number) => void;

  createDevice: (
    roomId: number,
    dto: {
      device_name: string;
      external_id?: string | null;
      is_on?: boolean | null;
    }
  ) => void;
  updateDevice: (
    roomId: number,
    deviceId: number,
    patch: DeviceUpdatePatch
  ) => void;
  deleteDevice: (deviceId: number, roomId: number) => void;
  toggleDevice: (deviceId: number) => void;
};

export function useRooms(homeId: number, token?: string): UseRoomsResult {
  const roomsQuery = useRoomsQuery({ homeId, token });
  const mutations = useRoomsMutations({ homeId, token });

  const result = useMemo<UseRoomsResult>(() => {
    const rooms = roomsQuery.data ?? [];

    const getRoomById = (roomId: number) => rooms.find((r) => r.id === roomId);
    const getDeviceById = (deviceId: number) =>
      rooms.flatMap((r) => r.devices).find((d) => d.id === deviceId);

    const toggleDevice = (deviceId: number) => {
      const device = getDeviceById(deviceId);
      if (!device) return;
      mutations.updateDeviceMutation.mutate({
        roomId: device.room_id,
        deviceId,
        patch: { is_on: !device.is_on },
      });
    };

    return {
      rooms,
      isLoading: roomsQuery.isLoading,
      isFetching: roomsQuery.isFetching,
      error: roomsQuery.error ?? null,

      getRoomById,
      getDeviceById,

      createRoom: (dto) => mutations.createRoomMutation.mutate({ dto }),
      updateRoom: (roomId, patch) =>
        mutations.updateRoomMutation.mutate({ roomId, patch }),
      deleteRoom: (roomId) => mutations.deleteRoomMutation.mutate({ roomId }),

      createDevice: (roomId, dto) =>
        mutations.createDeviceMutation.mutate({ roomId, dto }),
      updateDevice: (roomId, deviceId, patch) =>
        mutations.updateDeviceMutation.mutate({ roomId, deviceId, patch }),
      deleteDevice: (deviceId, roomId) =>
        mutations.deleteDeviceMutation.mutate({ roomId, deviceId }),
      toggleDevice,
    };
  }, [roomsQuery.data, roomsQuery.isLoading, roomsQuery.isFetching, roomsQuery.error, mutations]);

  return result;
}
