import { useCreateRoom } from "./mutations/useCreateRoom";
import { useUpdateRoom } from "./mutations/useUpdateRoom";
import { useDeleteRoom } from "./mutations/useDeleteRoom";
import { useCreateDevice } from "./mutations/useCreateDevice";
import { useUpdateDevice } from "./mutations/useUpdateDevice";
import { useDeleteDevice } from "./mutations/useDeleteDevice";
import { useTurnRoomOn } from "./mutations/useTurnRoomOn";
import { useTurnRoomOff } from "./mutations/useTurnRoomOff";

export function useRoomsMutations(args: { homeId: number; token?: string }) {
  const createRoomMutation = useCreateRoom(args);
  const updateRoomMutation = useUpdateRoom(args);
  const deleteRoomMutation = useDeleteRoom(args);
  
  const createDeviceMutation = useCreateDevice(args);
  const updateDeviceMutation = useUpdateDevice(args);
  const deleteDeviceMutation = useDeleteDevice(args);

  const turnRoomOnMutation = useTurnRoomOn(args);
  const turnRoomOffMutation = useTurnRoomOff(args);

  return {
    createRoomMutation,
    updateRoomMutation,
    deleteRoomMutation,
    createDeviceMutation,
    updateDeviceMutation,
    deleteDeviceMutation,
    turnRoomOnMutation,
    turnRoomOffMutation,
  };
}
