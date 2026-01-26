import { queryClient } from "@/lib/reactQuery";
import type { AuthUser, AuthSession } from "@/features/auth/auth.types";
import { authSessionKey } from "./auth.query";

export function getMeFromCache() {
  const session = queryClient.getQueryData<AuthSession>(authSessionKey);
  return session?.user;
}
