import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { apiRagSearchRecipes } from "./recipes.rag.api";
import type { RagRecipeResult } from "./recipes.rag.types";

const PRIMARY_QUERY =
  "Give me recipes that match these ingredient constraints.";
const SECONDARY_QUERY =
  "Give me quick and easy recipes that match these ingredient constraints.";

function normalizeList(input?: string[]) {
  if (!input?.length) return [];
  return Array.from(new Set(input.map((x) => x.trim()).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b)
  );
}

export function useRecipesRag(args: {
  token?: string;
  cuisines?: string[];
  mustContain?: string[];
  mustNotContain?: string[];
  enabled?: boolean;
}) {
  const enabled = args.enabled ?? true;

  const cuisines = useMemo(() => normalizeList(args.cuisines), [args.cuisines]);
  const mustContain = useMemo(
    () => normalizeList(args.mustContain),
    [args.mustContain]
  );
  const mustNotContain = useMemo(
    () => normalizeList(args.mustNotContain),
    [args.mustNotContain]
  );

  const queries = useQueries({
    queries: [
      {
        queryKey: [
          "recipes",
          "rag",
          "search",
          "primary",
          { cuisines, mustContain, mustNotContain },
        ],
        enabled,
        staleTime: 30_000,
        queryFn: ({ signal }) =>
          apiRagSearchRecipes({
            token: args.token,
            signal,
            query: PRIMARY_QUERY, 
            cuisines,
            mustContain,
            mustNotContain,
          }),
      },
      {
        queryKey: [
          "recipes",
          "rag",
          "search",
          "secondary",
          { cuisines, mustContain, mustNotContain },
        ],
        enabled,
        staleTime: 30_000,
        queryFn: ({ signal }) =>
          apiRagSearchRecipes({
            token: args.token,
            signal,
            query: SECONDARY_QUERY, 
            cuisines,
            mustContain,
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
  };
}
