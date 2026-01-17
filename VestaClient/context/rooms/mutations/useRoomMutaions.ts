import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../../../features/rooms/rooms.types";
import {
  apiCreateRoom,
  apiDeleteRoom,
  apiUpdateRoom,
} from "../../../features/rooms/rooms.api";
import type { RoomUpdatePatch } from "../../../features/rooms/rooms.write.types";
import { buildRoomUpdateDto } from "../../../features/rooms/rooms.write.types";
import { roomsKey } from "../rooms.query";
import { getRoomFromCache } from "../rooms.cache";

export function useRoomMutations(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  const updateRoomMutation = useMutation({
    mutationFn: async (vars: { roomId: number; patch: RoomUpdatePatch }) => {
      const current = getRoomFromCache(homeId, vars.roomId);
      if (!current)
        throw new Error("Room not found in cache. Try refetching rooms.");

      const body = buildRoomUpdateDto(current, vars.patch);
      return apiUpdateRoom({ roomId: vars.roomId,homeId:homeId, body, token });
    },

    onMutate: async ({ roomId, patch }) => {
      await queryClient.cancelQueries({ queryKey: roomsKey(homeId) });
      const prev = queryClient.getQueryData<Room[]>(roomsKey(homeId));

      queryClient.setQueryData<Room[]>(roomsKey(homeId), (current) => {
        if (!current) return current;

        return current.map((r) => {
          if (r.id !== roomId) return r;

          const next: Room = {
            ...r,
            room_name: patch.name
              ? { ...r.room_name, name: patch.name }
              : r.room_name,
          };
          return next;
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

  const updateRoom = useCallback(
    (roomId: number, patch: RoomUpdatePatch) => {
      updateRoomMutation.mutate({ roomId, patch });
    },
    [updateRoomMutation]
  );

  const createRoom = useCallback(
    (dto: { room_name: string }) => {
      createRoomMutation.mutate({ dto });
    },
    [createRoomMutation]
  );
  const deleteRoom = useCallback(
    (roomId: number) => {
      const current = getRoomFromCache(homeId, roomId);
      if (!current) return;
      deleteRoomMutation.mutate({ roomId });
    },
    [deleteRoomMutation, homeId]
  );

  return { updateRoom, createRoom,deleteRoom };
}
