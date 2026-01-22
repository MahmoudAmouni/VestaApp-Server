import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { Room } from "../../../features/rooms/rooms.types";
import { apiDeleteRoom } from "../../../features/rooms/rooms.api";
import { roomsKey } from "../useRoomsQuery";

import Toast from "react-native-toast-message";

export function useDeleteRoom(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation({
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
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Room Deleted",
        text2: "The room has been deleted successfully.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roomsKey(homeId) });
    },
  });
}
