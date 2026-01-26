import PantryScreen from "@/components/Pantry/PantryScreen";
import { PantryModalProvider } from "@/contexts/PantryModalContext";
import React from "react";

export default function Pantry() {
  return (
    <PantryModalProvider>
      <PantryScreen />
    </PantryModalProvider>
  );
}
