import { create } from 'zustand';
import { ExerciseResult, ReadingText } from "@/types/exercise";

interface ComprehensionState {
  pendingResult: ExerciseResult | null;
  activeText: ReadingText | null;

  setComprehensionContext: (result: ExerciseResult, text: ReadingText) => void;
  clearComprehensionContext: () => void;
}

export const useComprehensionStore = create<ComprehensionState>((set) => ({
  pendingResult: null,
  activeText: null,

  setComprehensionContext: (result, text) =>
    set({
      pendingResult: result,
      activeText: text,
    }),

  clearComprehensionContext: () =>
    set({
      pendingResult: null,
      activeText: null,
    }),
}));
