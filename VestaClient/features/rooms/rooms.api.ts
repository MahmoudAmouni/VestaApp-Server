import { fetchJson } from "../../api/http";
import type { ApiResponse, Device, Room, RoomsResponse } from "./rooms.types";
import { DeviceUpdateDto, RoomUpdateDto } from "./rooms.write.types";
type UpdateRoomResponse = ApiResponse<{ room: Room }>;
type UpdateDeviceResponse = ApiResponse<{ device: Device }>;

export async function apiGetRooms(params: {
  homeId: number;
  token?: string;
  signal?: AbortSignal;
}): Promise<Room[]> {
  const { homeId, token, signal } = params;

  const res = await fetchJson<RoomsResponse>(`/room/${homeId}`, {
    method: "GET",
    token,
    signal,
  });

  if (!res.success) throw new Error(res.message || "Rooms failed to load.");

  return res.data.rooms;
}


export async function apiUpdateRoom(params: {
  roomId: number;
  body: RoomUpdateDto;
  homeId: number;
  token?: string;
  signal?: AbortSignal;
}): Promise<Room> {
  const { roomId, body, token, signal,homeId } = params;
  console.log(body)


  const res = await fetchJson<UpdateRoomResponse>(
    `/room/${homeId}/${roomId}`,
    {
      method: "POST",
      token,
      signal,
      body,
    }
  );

  if (!res.success) throw new Error(res.message || "Failed to update room.");
  return res.data.room;
}

export async function apiUpdateDevice(params: {
  deviceId: number;
  roomId: number;
  homeId: number;
  body: DeviceUpdateDto;
  token?: string;
  signal?: AbortSignal;
}): Promise<Device> {
  const { deviceId, body, token,homeId, signal } = params;
  console.log(body)

  const res = await fetchJson<UpdateDeviceResponse>(
    `/device/${homeId}/${body.room_id}/${deviceId}`,
    {
      method: "POST",
      token,
      signal,
      body
    }
  );

  if (!res.success) throw new Error(res.message || "Failed to update device.");
  return res.data.device;
}

type CreateRoomResponse = ApiResponse<{ room: Room }>;
type CreateDeviceResponse = ApiResponse<{ device: Device }>;
export async function apiCreateRoom(params: {
  homeId: number;
  body: { room_name: string };
  token?: string;
  signal?: AbortSignal;
}): Promise<Room> {
  const { homeId, body, token, signal } = params;

  const res = await fetchJson<CreateRoomResponse>(`/room/${homeId}`, {
    method: "POST",
    token,
    signal,
    body,
  });

  if (!res.success) throw new Error(res.message || "Failed to create room.");
  return res.data.room;
}


export async function apiCreateDevice(params: {
  homeId: number;
  roomId: number;
  body: {
    device_name: string;
    external_id?: string | null;
    is_on?: boolean | null;
  };
  token?: string;
  signal?: AbortSignal;
}): Promise<Device> {
  const { homeId, roomId, body, token, signal } = params;

  const res = await fetchJson<CreateDeviceResponse>(
    `/device/${homeId}/${roomId}`,
    {
      method: "POST",
      token,
      signal,
      body,
    }
  );

  if (!res.success) throw new Error(res.message || "Failed to create device.");
  return res.data.device;
}



export function apiDeleteRoom(args: {
  homeId: number;
  roomId: number;
  token?: string;
  signal?: AbortSignal;
}) {
  const { homeId, roomId, token, signal } = args;

  return fetchJson<{ success?: boolean; message?: string }>(
    `/room/${homeId}/${roomId}`,
    { method: "GET", token, signal }
  );
}

export function apiDeleteDevice(args: {
  homeId: number;
  roomId: number;
  deviceId: number;
  token?: string;
  signal?: AbortSignal;
}) {
  const { homeId, roomId, deviceId, token, signal } = args;

  return fetchJson<{ success?: boolean; message?: string }>(
    `/device/${homeId}/${roomId}/${deviceId}`,
    { method: "GET", token, signal }
  );
}

export function apiTurnRoomOn(args: {
  homeId: number;
  roomId: number;
  token?: string;
  signal?: AbortSignal;
}) {
  const { homeId, roomId, token, signal } = args;
  return fetchJson<{ success?: boolean; message?: string }>(
    `/room/${homeId}/${roomId}/on`,
    { method: "POST", token, signal }
  );
}

export function apiTurnRoomOff(args: {
  homeId: number;
  roomId: number;
  token?: string;
  signal?: AbortSignal;
}) {
  const { homeId, roomId, token, signal } = args;
  return fetchJson<{ success?: boolean; message?: string }>(
    `/room/${homeId}/${roomId}/off`,
    { method: "POST", token, signal }
  );
}
