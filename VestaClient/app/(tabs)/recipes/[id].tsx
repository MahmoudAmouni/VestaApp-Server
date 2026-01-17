import RecipeDetailScreen from "@/components/RecipeDetail/RecipeDetailScreen";
import { useRecipesRag } from "@/features/recipes/useRecipesRag";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function SavedRecipes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {primaryResults} = useRecipesRag({mustContain:[],mustNotContain:[]})


  if(Number(id) > 10){
    const rec = primaryResults.find(rec => rec.id === id)
    return <RecipeDetailScreen recipe={rec}/>
  }
}
