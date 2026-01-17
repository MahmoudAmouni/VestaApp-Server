import  { createContext, useContext } from "react";
import type { Room, Device } from "../../features/rooms/rooms.types";
import type {
  DeviceUpdatePatch,
  RoomUpdatePatch,
} from "../../features/rooms/rooms.write.types";

export type RoomsContextValue = {
  rooms: Room[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;

  getRoomById: (roomId: number) => Room | undefined;
  getDeviceById: (deviceId: number) => Device | undefined;

  deleteRoom: (roomId: number) => void;
  deleteDevice: (deviceId: number, roomId: number) => void;

  updateRoom: (roomId: number, patch: RoomUpdatePatch) => void;
  updateDevice: (
    roomId: number,
    deviceId: number,
    patch: DeviceUpdatePatch
  ) => void;

  toggleDevice: (deviceId: number) => void;

  createRoom: (dto: { room_name: string }) => void;
  createDevice: (
    roomId: number,
    dto: {
      device_name: string;
      external_id?: string | null;
      is_on?: boolean | null;
    }
  ) => void;
};

export const RoomsContext = createContext<RoomsContextValue | undefined>(
  undefined
);

export function useRooms() {
  const ctx = useContext(RoomsContext);
  if (!ctx) throw new Error("useRooms must be used within <RoomsProvider />");
  return ctx;
}
