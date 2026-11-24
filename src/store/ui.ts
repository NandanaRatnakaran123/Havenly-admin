import { create } from "zustand";
import type { UserRole } from "@/types";

interface UiState {
  sidebarOpen: boolean; // mobile drawer
  role: UserRole; // set from the backend session once /me exists
  setSidebarOpen: (open: boolean) => void;
  setRole: (role: UserRole) => void;
}

export const useUi = create<UiState>((set) => ({
  sidebarOpen: false,
  role: "admin",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setRole: (role) => set({ role }),
}));
