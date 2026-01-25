import AiChatScreen from '@/React-Native/components/AiChat/AiChatScreen'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

export default function AiScreen() {
  const { recipeData } = useLocalSearchParams<{ recipeData?: string }>();

  return (
    <AiChatScreen recipeData={recipeData} />
  )
}
