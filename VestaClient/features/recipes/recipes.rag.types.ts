export type RagSearchRequest = {
  query: string;
  n_results: number;
  cuisines?: string[];
  must_contain?: string[];
  must_not_contain?: string[];
};

export type RagRecipeResultRaw = {
  id: string;
  recipe_name: string;
  cuisine_primary?: string;
  cuisines?: string[];
  ingredients: string[];
  directions: string[];
  description: string;
  distance?: number;
};

export type RagSearchResponseRaw = {
  query: string;
  count: number;
  results: RagRecipeResultRaw[];
};

export type RagRecipeResult = Omit<
  RagRecipeResultRaw,
  "ingredients" | "directions"
> & {
  ingredients: string; 
  directions: string; 
};

export type RagSearchResponse = Omit<RagSearchResponseRaw, "results"> & {
  results: RagRecipeResult[];
};
