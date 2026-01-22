import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { apiRagSearchRecipes } from "./recipes.rag.api";
import type { RagRecipeResult } from "./recipes.rag.types";

const PRIMARY_QUERY =
  "Give me recipes that match these ingredient constraints.";
const SECONDARY_QUERY =
  "Give me random popular recipes from different cuisines.";

function normalizeList(input?: string[]) {
  if (!input?.length) return [];
  return Array.from(
    new Set(
      input
        .filter((x) => x != null && x !== undefined) 
        .map((x) => x.trim())
        .filter(Boolean) 
    )
  ).sort((a, b) => a.localeCompare(b));
}

export function useRecipesRag(args: {
  token?: string;
  pantryItems?: string[];
  cuisines?: string[];
  mustNotContain?: string[];
  enabled?: boolean;
}) {
  const enabled = args.enabled ?? true;
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const cuisines = useMemo(() => normalizeList(args.cuisines), [args.cuisines]);
  const pantryItems = useMemo(
    () => normalizeList(args.pantryItems),
    [args.pantryItems]
  );
  const mustNotContain = useMemo(
    () => normalizeList(args.mustNotContain),
    [args.mustNotContain]
  );

  const shouldUsePantry = pantryItems.length >= 5;
  const firstQueryMustContain = shouldUsePantry ? pantryItems : [];
  const secondQueryMustContain: string[] = [];

  const queries = useQueries({
    queries: [
      {
        queryKey: [
          "recipes",
          "rag",
          "search",
          "primary",
          { cuisines, mustContain: firstQueryMustContain, mustNotContain, refreshKey },
        ],
        enabled,
        staleTime: 0, 
        queryFn: ({ signal }) =>
          apiRagSearchRecipes({
            token: args.token,
            signal,
            query: PRIMARY_QUERY, 
            cuisines,
            mustContain: firstQueryMustContain,
            mustNotContain,
          }),
      },
      {
        queryKey: [
          "recipes",
          "rag",
          "search",
          "secondary",
          { cuisines, mustContain: secondQueryMustContain, mustNotContain, refreshKey },
        ],
        enabled,
        staleTime: 0, 
        queryFn: ({ signal }) =>
          apiRagSearchRecipes({
            token: args.token,
            signal,
            query: SECONDARY_QUERY, 
            cuisines,
            mustContain: secondQueryMustContain,
            mustNotContain,
          }),
      },
    ],
  });

  const primary = queries[0];
  const secondary = queries[1];

  const primaryResults: RagRecipeResult[] = primary.data?.results ?? [];
  const secondaryResults: RagRecipeResult[] = secondary.data?.results ?? [];

  return {
    primaryResults,
    secondaryResults,

    isLoading: primary.isLoading || secondary.isLoading,
    isFetching: primary.isFetching || secondary.isFetching,
    error: primary.error ?? secondary.error ?? null,
    refetch: async () => {
      console.log("Refreshing recipes data...");
      setRefreshKey(Date.now());
    }
  };
}
