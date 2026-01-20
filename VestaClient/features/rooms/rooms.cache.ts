import { roomsKey } from "@/hooks/rooms/useRoomsQuery";
import { queryClient } from "../../lib/reactQuery";
import type { Room, Device } from "./rooms.types";

export function getRoomFromCache(
  homeId: number,
  roomId: number
): Room | undefined {
  const rooms = queryClient.getQueryData<Room[]>(roomsKey(homeId));//redirect urls missing scope
  return rooms?.find((r) => r.id === roomId);
}

export function getDeviceFromCache(
  homeId: number,
  deviceId: number
): Device | undefined {
  const rooms = queryClient.getQueryData<Room[]>(roomsKey(homeId));
  return rooms?.flatMap((r) => r.devices).find((d) => d.id === deviceId);
}
