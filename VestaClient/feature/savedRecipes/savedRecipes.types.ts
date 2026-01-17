import type { ApiResponse } from "../rooms/rooms.types";

export type SavedRecipe = {
  id: number;

  recipe_name: string;

  ingredients: string; 
  directions: string; 

  cuisine_primary: string | null;
  description: string | null;

  created_at?: string | null;
  updated_at?: string | null;
};

export type SavedRecipeRaw = {
  id: number;

  home_id?: number;
  created_at?: string | null;
  updated_at?: string | null;

  recipe_name: string;
  ingredients?: string | null;
  directions?: string | null;

  cuisine_primary?: string | null;
  description?: string | null;
};

export type SavedRecipeListResponseRaw = ApiResponse<{
  saved_recipes: SavedRecipeRaw[];
}>;

export type SavedRecipeWriteDto = {
  recipe_name: string;
  ingredients: string | null; // "$$" string
  directions: string | null; // "$$" string
  cuisine_primary: string | null;
  description: string | null;
};

export function mapSavedRecipe(raw: SavedRecipeRaw): SavedRecipe {
  const name = (raw.recipe_name ?? "").toString().trim();
  if (!name) throw new Error("Saved recipe is missing recipe_name from API response.");

  return {
    id: raw.id,
    recipe_name: name,
    ingredients: (raw.ingredients ?? "") || "",
    directions: (raw.directions ?? "") || "",
    cuisine_primary: raw.cuisine_primary ?? null,
    description: raw.description ?? null,
    created_at: raw.created_at ?? null,
    updated_at: raw.updated_at ?? null,
  };
}
