import { queryClient } from "@/React-Native/lib/reactQuery";
import type { AuthUser, AuthSession } from "@/React-Native/features/auth/auth.types";
import { authSessionKey } from "./auth.query";

export function getMeFromCache() {
  const session = queryClient.getQueryData<AuthSession>(authSessionKey);
  return session?.user;
}
