import type { Device, Room } from "./rooms.types";


export type RoomUpdatePatch = {
  name?: string; 
};

export type DeviceUpdatePatch = {
  name?: string;
  external_id?: string; 
  is_on?: boolean; 
};


export type RoomUpdateDto = {
  room_name: string; 
};

export type DeviceUpdateDto = {
  id: number;
  room_id: number;
  device_name: string;
  external_id: string;
  is_on: boolean;
};

export type RoomCreateDto = {
  room_name: string;
};

export type DeviceCreateDto = {
  device_name: string;
  external_id?: string | null;
  is_on?: boolean | null;
};


export function buildRoomUpdateDto(
  room: Room,
  patch: RoomUpdatePatch
): RoomUpdateDto {
  return {
    room_name: patch.name ?? room.room_name?.name ?? "",
  };
}

export function buildDeviceUpdateDto(
  device: Device,
  patch: DeviceUpdatePatch
): DeviceUpdateDto {
  return {
    id: device.id,
    room_id: device.room_id,
    device_name: patch.name ?? device.device_name?.name ?? "",
    external_id: patch.external_id ?? device.external_id,
    is_on: patch.is_on ?? device.is_on,
  };
}
