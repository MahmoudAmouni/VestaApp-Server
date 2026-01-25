import { fetchJson } from "../../api/http";
import type { ApiResponse } from "../rooms/rooms.types";
import type {
  SavedRecipe,
  SavedRecipeRaw,
  SavedRecipeWriteDto,
  SavedRecipeListResponseRaw,
} from "./savedRecipes.types";
import { mapSavedRecipe } from "./savedRecipes.types";

type SavedRecipeResponseRaw = ApiResponse<{
  saved_recipe?: SavedRecipeRaw;
}>;

export async function apiGetSavedRecipes(params: {
  homeId: number;
  token?: string;
  signal?: AbortSignal;
}): Promise<SavedRecipe[]> {
  const { homeId, token, signal } = params;

  const res = await fetchJson<SavedRecipeListResponseRaw>(
    `/savedrecipe/${homeId}`,
    {
      method: "GET",
      token,
      signal,
    }
  );

  if (!res.success)
    throw new Error(res.message || "Saved recipes failed to load.");

  const raw = Array.isArray(res.data?.saved_recipes)
    ? res.data.saved_recipes
    : [];
  return raw.map(mapSavedRecipe);
}

export async function apiCreateSavedRecipe(params: {
  homeId: number;
  body: SavedRecipeWriteDto;
  token?: string;
  signal?: AbortSignal;
}): Promise<SavedRecipe | null> {
  const { homeId, body, token, signal } = params;

  const res = await fetchJson<SavedRecipeResponseRaw>(
    `/savedrecipe/${homeId}`,
    {
      method: "POST",
      token,
      signal,
      body,
    }
  );

  if (!res.success) throw new Error(res.message || "Failed to save recipe.");

  const created = res.data?.saved_recipe;
  return created ? mapSavedRecipe(created) : null;
}

/**
 * Backend deletes via GET /savedrecipe/{home_id}/{recipe_name}
 * Make sure recipe_name is URL-encoded (spaces, symbols).
 */
export async function apiDeleteSavedRecipeByName(params: {
  homeId: number;
  recipeName: string;
  token?: string;
  signal?: AbortSignal;
}): Promise<void> {
  const { homeId, recipeName, token, signal } = params;

  const encoded = encodeURIComponent(recipeName);

  const res = await fetchJson<ApiResponse<unknown>>(
    `/savedrecipe/${homeId}/${encoded}`,
    { method: "GET", token, signal }
  );

  if (!res.success)
    throw new Error(res.message || "Failed to delete saved recipe.");
}
