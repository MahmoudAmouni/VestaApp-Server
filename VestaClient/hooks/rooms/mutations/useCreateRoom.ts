import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../../../features/rooms/rooms.types";
import { apiCreateRoom } from "../../../features/rooms/rooms.api";
import { roomsKey } from "../useRoomsQuery";

import Toast from "react-native-toast-message";

export function useCreateRoom(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation({
    mutationFn: async (vars: { dto: { room_name: string } }) => {
      return apiCreateRoom({ homeId, body: vars.dto, token });
    },
    onSuccess: (createdRoom) => {
      Toast.show({
        type: "success",
        text1: "Room Created",
        text2: `${createdRoom.room_name.name} has been created successfully.`,
      });

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
}
