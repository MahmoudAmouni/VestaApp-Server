import { useCreateRoom } from "./mutations/useCreateRoom";
import { useUpdateRoom } from "./mutations/useUpdateRoom";
import { useDeleteRoom } from "./mutations/useDeleteRoom";
import { useCreateDevice } from "./mutations/useCreateDevice";
import { useUpdateDevice } from "./mutations/useUpdateDevice";
import { useDeleteDevice } from "./mutations/useDeleteDevice";

export function useRoomsMutations(args: { homeId: number; token?: string }) {
  const createRoomMutation = useCreateRoom(args);
  const updateRoomMutation = useUpdateRoom(args);
  const deleteRoomMutation = useDeleteRoom(args);
  
  const createDeviceMutation = useCreateDevice(args);
  const updateDeviceMutation = useUpdateDevice(args);
  const deleteDeviceMutation = useDeleteDevice(args);

  return {
    createRoomMutation,
    updateRoomMutation,
    deleteRoomMutation,
    createDeviceMutation,
    updateDeviceMutation,
    deleteDeviceMutation,
  };
}
