import { queryClient } from "@/lib/reactQuery";
import type { AuthUser } from "@/features/auth/auth.types";
import { meKey } from "./auth.query";

export function getMeFromCache() {
  return queryClient.getQueryData<AuthUser>(meKey());
}
