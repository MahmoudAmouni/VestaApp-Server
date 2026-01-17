import { useRoomMutations } from "./useRoomMutaions";
import { useDeviceMutations } from "./useDeviceMutations";

export function useRoomsMutations(args: { homeId: number; token?: string }) {
  const room = useRoomMutations(args);
  const device = useDeviceMutations(args);

  return {
    ...room,
    ...device,
  };
}
