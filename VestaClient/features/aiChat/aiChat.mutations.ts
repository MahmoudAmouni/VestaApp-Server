import { useSendChatMessage } from "./mutations/useSendChatMessage";
import { useDeleteChatMessage } from "./mutations/useDeleteChatMessage";

export function useAiChatMutations(args: {
  homeId: number;
  token?: string;
}) {
  const sendMutation = useSendChatMessage(args);
  const deleteMutation = useDeleteChatMessage(args);
  const isPending = sendMutation.isPending;

  return {
    sendMutation,
    deleteMutation,
    isSending: Boolean(isPending),
  };
}
