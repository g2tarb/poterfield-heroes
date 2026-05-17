"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type Ctx = {
  // Module ciblé en ce moment (hover ou défaut). null si rien.
  focused: number | null;
  // Module par défaut (actif), affiché quand pas de hover en cours
  defaultModule: number | null;
  // Hover entrée/sortie sur une station
  setHovered: (moduleNumber: number | null) => void;
};

const FocusedModuleContext = createContext<Ctx | null>(null);

export function FocusedModuleProvider({
  defaultModule,
  children,
}: {
  defaultModule: number | null;
  children: ReactNode;
}) {
  const [hovered, setHoveredState] = useState<number | null>(null);

  const setHovered = useCallback((moduleNumber: number | null) => {
    setHoveredState(moduleNumber);
  }, []);

  const focused = hovered ?? defaultModule;

  return (
    <FocusedModuleContext.Provider
      value={{ focused, defaultModule, setHovered }}
    >
      {children}
    </FocusedModuleContext.Provider>
  );
}

export function useFocusedModule(): Ctx {
  const ctx = useContext(FocusedModuleContext);
  if (!ctx) {
    // Fallback no-op si on est en dehors du provider (composants partagés)
    return {
      focused: null,
      defaultModule: null,
      setHovered: () => undefined,
    };
  }
  return ctx;
}
