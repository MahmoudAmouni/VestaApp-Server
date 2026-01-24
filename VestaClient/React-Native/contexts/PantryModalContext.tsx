import React, { createContext, useContext, useMemo, useState } from "react";
import type { PantryItem } from "@/React-Native/features/pantry/pantry.types";

type PantryModalContextValue = {
  showModal: boolean;
  setShowModal: (open: boolean, item?: PantryItem | null) => void;
  pantryItem: PantryItem | null;
};

const PantryModalContext = createContext<PantryModalContextValue | undefined>(
  undefined
);

export function PantryModalProvider(props: { children: React.ReactNode }) {
  const { children } = props;

  const [showModal, setShowModalState] = useState(false);
  const [pantryItem, setPantryItem] = useState<PantryItem | null>(null);

  function setShowModal(open: boolean, item?: PantryItem | null) {
    setShowModalState(open);

    if (open) {
      if (item !== undefined) setPantryItem(item ?? null);
    } else {
      setPantryItem(null);
    }
  };

  const value = useMemo(
    () => ({ showModal, setShowModal, pantryItem }),
    [showModal, pantryItem]
  );

  return (
    <PantryModalContext.Provider value={value}>
      {children}
    </PantryModalContext.Provider>
  );
}

export function usePantryModal() {
  const ctx = useContext(PantryModalContext);
  if (!ctx) {
    throw new Error(
      "usePantryModal must be used within <PantryModalProvider />"
    );
  }
  return ctx;
}
