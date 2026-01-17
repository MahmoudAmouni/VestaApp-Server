export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type RoomName = { id: number; name: string };
export type DeviceName = { id: number; name: string };

export type Device = {
  id: number;
  room_id: number;
  device_name_id: number;
  external_id: string;
  is_on: boolean;
  device_name: DeviceName;
};

export type Room = {
  id: number;
  home_id: number;
  room_name_id: number;
  room_name: RoomName;
  devices: Device[];
};

export type RoomsResponse = ApiResponse<{ rooms: Room[] }>;
