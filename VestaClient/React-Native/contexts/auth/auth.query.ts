import { useQuery } from "@tanstack/react-query";
import type { AuthSession } from "../../features/auth/auth.types";
import { loadAuthSession } from "../../features/auth/auth.storage";

export const authSessionKey = ["auth", "session"] as const;

export function useAuthSessionQuery() {
  return useQuery<AuthSession | null, Error>({
    queryKey: authSessionKey,
    queryFn: () => loadAuthSession(),
    staleTime: Infinity,
  });
}
