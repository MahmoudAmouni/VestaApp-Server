import { useQuery } from "@tanstack/react-query";
import type { PantryItem } from "./pantry.types";
import { apiGetPantry } from "./pantry.api";

export const pantryKey = (homeId: number) =>
  ["pantry", "home", homeId] as const;

export function usePantryQuery(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useQuery<PantryItem[], Error>({
    queryKey: pantryKey(homeId),
    queryFn: ({ signal }) => apiGetPantry({ homeId, token, signal }),
    staleTime: 30_000,
  });
}
