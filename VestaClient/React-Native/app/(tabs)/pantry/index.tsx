import PantryScreen from "@/React-Native/components/Pantry/PantryScreen";
import { PantryModalProvider } from "@/React-Native/contexts/PantryModalContext";
import React from "react";

export default function Pantry() {
  return (
    <PantryModalProvider>
      <PantryScreen />
    </PantryModalProvider>
  );
}
