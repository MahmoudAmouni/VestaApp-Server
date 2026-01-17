import React, { useMemo } from "react";
import { useRoomsMutations } from "./mutations/useRoomsMutation";
import { useRoomsQuery } from "./rooms.query";
import { RoomsContext, RoomsContextValue } from "./RoomsContext";

export function RoomsProvider({
  homeId,
  token,
  children,
}: {
  homeId: number;
  token?: string;
  children: React.ReactNode;
}) {
  const roomsQuery = useRoomsQuery({ homeId, token });

  const { updateRoom, updateDevice, toggleDevice, createRoom, createDevice,deleteDevice,deleteRoom } =
    useRoomsMutations({ homeId, token });

  const value = useMemo<RoomsContextValue>(() => {
    const rooms = roomsQuery.data ?? [];

    return {
      rooms,
      isLoading: roomsQuery.isLoading,
      isFetching: roomsQuery.isFetching,
      error: roomsQuery.error ?? null,

      getRoomById: (roomId) => rooms.find((r) => r.id === roomId),
      getDeviceById: (deviceId) =>
        rooms.flatMap((r) => r.devices).find((d) => d.id === deviceId),

      updateRoom,
      updateDevice,
      toggleDevice,
      createRoom,
      createDevice,
      deleteDevice,
      deleteRoom,
    };
  }, [
    roomsQuery.data,
    roomsQuery.isLoading,
    roomsQuery.isFetching,
    roomsQuery.error,
    updateRoom,
    updateDevice,
    toggleDevice,
    createRoom,
    createDevice,
    deleteDevice,
    deleteRoom,
  ]);

  return (
    <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>
  );
}
