import { create } from "zustand";
import { Store } from "./types";

export const useBearStore = create<Store>()((set) => ({
  inputPath: "",
  enterPath: (path: string) => set({ inputPath: path }),
  scale: 1,
  setScale: (scale: number) => set({ scale: scale }),
  debug: false,
  setDebug: () => set((state) => ({ debug: !state.debug })),
  operator: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  setOperator: (operator: number[][]) => set({ operator: operator }),
}));
