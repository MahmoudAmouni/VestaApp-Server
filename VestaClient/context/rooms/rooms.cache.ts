import { queryClient } from "../../lib/reactQuery";
import type { Room } from "../../features/rooms/rooms.types";
import { roomsKey } from "./rooms.query";

export function getRoomFromCache(homeId: number, roomId: number) {
  const rooms = queryClient.getQueryData<Room[]>(roomsKey(homeId)) ?? [];
  return rooms.find((r) => r.id === roomId);
}

export function getDeviceFromCache(homeId: number, deviceId: number) {
  const rooms = queryClient.getQueryData<Room[]>(roomsKey(homeId)) ?? [];
  return rooms.flatMap((r) => r.devices).find((d) => d.id === deviceId);
}
