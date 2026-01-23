import { useQuery } from "@tanstack/react-query";
import type { PantryItem } from "../../features/pantry/pantry.types";
import { apiGetPantry } from "../../features/pantry/pantry.api";

export const pantryKey = (homeId?: number | null) =>
  ["pantry", "home", homeId] as const;

export function usePantryQuery(args: { homeId?: number | null; token?: string }) {
  const { homeId, token } = args;

  return useQuery<PantryItem[], Error>({
    queryKey: pantryKey(homeId),
    queryFn: ({ signal }) => {
      if (homeId === undefined || homeId === null) {
        throw new Error("Home ID is required");
      }
      return apiGetPantry({ homeId, token, signal });
    },
    staleTime: 30_000,
    enabled: !!homeId,
  });
}
