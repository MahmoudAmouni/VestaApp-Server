import { queryClient } from "../../lib/reactQuery";
import type { PantryItem } from "./pantry.types";
import { pantryKey } from "./pantry.query";

export function getPantryItemFromCache(homeId: number, pantryItemId: number) {
  const list = queryClient.getQueryData<PantryItem[]>(pantryKey(homeId)) ?? [];
  return list.find((x) => x.id === pantryItemId);
}
