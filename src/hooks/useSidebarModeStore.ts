import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export type SidebarModeType = "normal" | "mini";

type SidebarModeStore = {
  mode: SidebarModeType;
  setMode: (mode: SidebarModeType) => void;
};
export const useSidebarModeStore = create<SidebarModeStore>()(
  devtools(
    persist(
      (set) => ({
        mode: "mini",
        setMode: (mode) => set({ mode }),
      }),
      { name: "sidebar-mode" }
    )
  )
);
