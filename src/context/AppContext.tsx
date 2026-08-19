import { createContext, useContext, useState } from "react";
import type { Lot, AppState } from "../types";

interface AppContextType {
  role: "driver" | "owner";
  setRole: (r: "driver" | "owner") => void;
  appState: AppState;
  startParking: (lot: Lot) => void;
  endParking: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole]       = useState<"driver" | "owner">("driver");
  const [appState, setAppState] = useState<AppState>({
    isParking: false,
    activeLot: null,
    parkingStart: null,
  });

  function startParking(lot: Lot) {
    setAppState({ isParking: true, activeLot: lot, parkingStart: new Date() });
  }

  function endParking() {
    setAppState({ isParking: false, activeLot: null, parkingStart: null });
  }

  return (
    <AppContext.Provider value={{ role, setRole, appState, startParking, endParking }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
