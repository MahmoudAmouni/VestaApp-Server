import { queryClient } from "@/lib/reactQuery";
import type { User } from "@/features/auth/auth.types";
import { meKey } from "./auth.query";

export function getMeFromCache() {
  return queryClient.getQueryData<User>(meKey());
}
